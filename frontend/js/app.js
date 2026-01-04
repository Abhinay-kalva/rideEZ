// Main Application Logic
class App {
    constructor() {
        this.currentUser = null;
        this.activeRide = null;
        this.setupEventListeners();
    }

    init() {
        this.currentUser = authManager.getCurrentUser();
        if (!this.currentUser) {
            authManager.showAuth();
            return;
        }

        this.loadDashboard();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('navDashboard')?.addEventListener('click', () => {
            this.loadDashboard();
            this.setActiveNav('navDashboard');
        });

        document.getElementById('navRides')?.addEventListener('click', () => {
            this.loadMyRides();
            this.setActiveNav('navRides');
        });

        document.getElementById('navBookings')?.addEventListener('click', () => {
            this.loadMyBookings();
            this.setActiveNav('navBookings');
        });

        // Create Ride
        document.getElementById('createRideBtn')?.addEventListener('click', () => {
            this.showCreateRideModal();
        });

        document.getElementById('createRideForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateRide();
        });

        // Modal close
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        // End Ride
        document.getElementById('endRideBtn')?.addEventListener('click', () => {
            this.handleEndRide();
        });

        // SOS Button
        document.getElementById('sosBtn')?.addEventListener('click', () => {
            this.handleSOS();
        });
    }

    setActiveNav(navId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(navId)?.classList.add('active');
    }

    async loadDashboard() {
        const role = this.currentUser.role;
        
        if (role === 'RIDER') {
            document.getElementById('rider-dashboard').classList.remove('hidden');
            document.getElementById('passenger-dashboard').classList.add('hidden');
            await this.loadRiderDashboard();
        } else {
            document.getElementById('rider-dashboard').classList.add('hidden');
            document.getElementById('passenger-dashboard').classList.remove('hidden');
            await this.loadPassengerDashboard();
        }
    }

    async loadRiderDashboard() {
        try {
            const rides = await api.getMyRides();
            this.displayRiderRides(rides);
        } catch (error) {
            console.error('Error loading rides:', error);
        }
    }

    async loadPassengerDashboard() {
        // Initialize map if needed
        if (window.mapsManager && !window.mapsManager.passengerMap) {
            window.mapsManager.initMaps();
        }

        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('searchDate').value = today;

        document.getElementById('searchRidesBtn').addEventListener('click', async () => {
            await this.searchRides();
        });
    }

    async searchRides() {
        const date = document.getElementById('searchDate').value;
        if (!date) {
            alert('Please select a date');
            return;
        }

        try {
            const dateTime = new Date(date).toISOString();
            const rides = await api.searchRides(null, null, dateTime);
            this.displayAvailableRides(rides);
            if (window.mapsManager) {
                window.mapsManager.showRidesOnMap(rides);
            }
        } catch (error) {
            alert('Error searching rides: ' + error.message);
        }
    }

    displayRiderRides(rides) {
        const container = document.getElementById('rider-rides-list');
        if (!container) return;

        if (rides.length === 0) {
            container.innerHTML = '<p>No rides created yet. Create your first ride!</p>';
            return;
        }

        container.innerHTML = rides.map(ride => this.createRideCard(ride, true)).join('');
        
        // Add event listeners to ride cards
        container.querySelectorAll('.ride-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showRideDetails(rides[index]);
            });
        });
    }

    displayAvailableRides(rides) {
        const container = document.getElementById('available-rides-list');
        if (!container) return;

        if (rides.length === 0) {
            container.innerHTML = '<p>No rides available for the selected date.</p>';
            return;
        }

        container.innerHTML = rides.map(ride => this.createRideCard(ride, false)).join('');
        
        // Add event listeners
        container.querySelectorAll('.ride-card').forEach((card, index) => {
            card.addEventListener('click', () => {
                this.showRideDetails(rides[index]);
            });
        });
    }

    createRideCard(ride, isRider) {
        const statusClass = `status-${ride.status.toLowerCase()}`;
        const date = new Date(ride.dateTime).toLocaleString();
        
        return `
            <div class="ride-card">
                <div class="ride-card-header">
                    <h3>${ride.rider?.name || 'Rider'}</h3>
                    <span class="ride-status ${statusClass}">${ride.status}</span>
                </div>
                <div class="ride-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${ride.sourceAddress || 'Source'}</span>
                </div>
                <div class="ride-info">
                    <i class="fas fa-flag"></i>
                    <span>${ride.destAddress || 'Destination'}</span>
                </div>
                <div class="ride-info">
                    <i class="fas fa-calendar"></i>
                    <span>${date}</span>
                </div>
                <div class="ride-info">
                    <i class="fas fa-rupee-sign"></i>
                    <span>₹${ride.price}</span>
                </div>
                ${!isRider ? `
                    <div class="ride-actions">
                        <button class="btn btn-primary" onclick="event.stopPropagation(); window.app.bookRide(${ride.id})">
                            Book Ride
                        </button>
                    </div>
                ` : `
                    <div class="ride-actions">
                        ${ride.status === 'CREATED' || ride.status === 'BOOKED' ? `
                            <button class="btn btn-primary" onclick="event.stopPropagation(); window.app.startRide(${ride.id})">
                                Start Ride
                            </button>
                        ` : ''}
                        ${ride.status === 'ONGOING' ? `
                            <button class="btn btn-danger" onclick="event.stopPropagation(); window.app.endRide(${ride.id})">
                                End Ride
                            </button>
                        ` : ''}
                    </div>
                `}
            </div>
        `;
    }

    showCreateRideModal() {
        document.getElementById('createRideModal').classList.remove('hidden');
        
        // Initialize maps if needed
        if (window.mapsManager) {
            setTimeout(() => {
                if (!window.mapsManager.sourceMap) {
                    window.mapsManager.initMaps();
                }
            }, 100);
        }
    }

    async handleCreateRide() {
        const rideData = {
            sourceLat: parseFloat(document.getElementById('sourceLat').value),
            sourceLng: parseFloat(document.getElementById('sourceLng').value),
            sourceAddress: document.getElementById('sourceAddress').value,
            destLat: parseFloat(document.getElementById('destLat').value),
            destLng: parseFloat(document.getElementById('destLng').value),
            destAddress: document.getElementById('destAddress').value,
            dateTime: document.getElementById('rideDateTime').value,
            price: parseFloat(document.getElementById('ridePrice').value)
        };

        // Validate
        if (!rideData.sourceLat || !rideData.sourceLng || !rideData.destLat || !rideData.destLng) {
            alert('Please select source and destination locations');
            return;
        }

        try {
            await api.createRide(rideData);
            alert('Ride created successfully!');
            document.getElementById('createRideModal').classList.add('hidden');
            document.getElementById('createRideForm').reset();
            this.loadRiderDashboard();
        } catch (error) {
            alert('Error creating ride: ' + error.message);
        }
    }

    async startRide(rideId) {
        try {
            const ride = await api.startRide(rideId);
            this.activeRide = ride;
            this.showActiveRideControl(ride);
            
            // Start location tracking
            if (window.firebaseManager) {
                window.firebaseManager.startLocationTracking(rideId, (location) => {
                    if (window.mapsManager) {
                        window.mapsManager.updateRiderLocation(location.lat, location.lng);
                    }
                });
            }

            // Draw route
            if (window.mapsManager && window.mapsManager.riderMap) {
                window.mapsManager.drawRoute(
                    window.mapsManager.riderMap,
                    { lat: ride.sourceLat, lng: ride.sourceLng },
                    { lat: ride.destLat, lng: ride.destLng }
                );
            }

            this.loadRiderDashboard();
        } catch (error) {
            alert('Error starting ride: ' + error.message);
        }
    }

    async handleEndRide() {
        if (!this.activeRide) return;

        try {
            await api.endRide(this.activeRide.id);
            alert('Ride ended successfully!');
            this.activeRide = null;
            document.getElementById('activeRideControl').classList.add('hidden');
            
            // Stop location tracking
            if (window.firebaseManager) {
                window.firebaseManager.stopLocationTracking();
            }

            this.loadRiderDashboard();
        } catch (error) {
            alert('Error ending ride: ' + error.message);
        }
    }

    async bookRide(rideId) {
        if (!confirm('Are you sure you want to book this ride?')) {
            return;
        }

        try {
            await api.bookRide(rideId);
            alert('Ride booked successfully!');
            this.searchRides();
        } catch (error) {
            alert('Error booking ride: ' + error.message);
        }
    }

    showRideDetails(ride) {
        const modal = document.getElementById('rideDetailsModal');
        const content = document.getElementById('rideDetailsContent');
        
        content.innerHTML = `
            <h2>Ride Details</h2>
            <div class="ride-info">
                <p><strong>Rider:</strong> ${ride.rider?.name || 'N/A'}</p>
                <p><strong>Rating:</strong> ${ride.rider?.rating || 0} ⭐</p>
                <p><strong>Source:</strong> ${ride.sourceAddress || 'N/A'}</p>
                <p><strong>Destination:</strong> ${ride.destAddress || 'N/A'}</p>
                <p><strong>Date & Time:</strong> ${new Date(ride.dateTime).toLocaleString()}</p>
                <p><strong>Price:</strong> ₹${ride.price}</p>
                <p><strong>Status:</strong> ${ride.status}</p>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }

    showActiveRideControl(ride) {
        document.getElementById('activeRideInfo').textContent = 
            `From ${ride.sourceAddress || 'Source'} to ${ride.destAddress || 'Destination'}`;
        document.getElementById('activeRideControl').classList.remove('hidden');
    }

    handleSOS() {
        alert('SOS Alert! Emergency services have been notified.');
        // In a real implementation, this would send an emergency alert
    }

    async loadMyRides() {
        // Implementation for "My Rides" page
        this.loadRiderDashboard();
    }

    async loadMyBookings() {
        try {
            const bookings = await api.getMyBookings();
            // Display bookings (implementation similar to rides)
            console.log('Bookings:', bookings);
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    // Check if user is already logged in
    if (authManager.isAuthenticated()) {
        authManager.showMainApp();
    }
});



