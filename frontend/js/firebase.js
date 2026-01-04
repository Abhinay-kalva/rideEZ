// Firebase Realtime Database Integration
class FirebaseManager {
    constructor() {
        this.database = null;
        this.locationWatchId = null;
        this.rideLocationRef = null;
    }

    async init() {
        // Firebase is initialized in HTML
        // Wait for it to be available
        if (typeof firebase !== 'undefined' && window.firebaseDatabase) {
            this.database = window.firebaseDatabase;
        }
    }

    startLocationTracking(rideId, callback) {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported');
            return;
        }

        // Update location every 3 seconds
        this.locationWatchId = setInterval(() => {
            navigator.geolocation.getCurrentPosition((position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: Date.now()
                };

                // Save to Firebase
                this.updateRideLocation(rideId, location);

                // Callback for map update
                if (callback) {
                    callback(location);
                }
            });
        }, 3000);
    }

    async updateRideLocation(rideId, location) {
        if (!this.database) {
            console.error('Firebase database not initialized');
            return;
        }

        try {
            this.database.ref(`rides/${rideId}/location`).set(location);
        } catch (error) {
            console.error('Error updating location:', error);
        }
    }

    subscribeToRideLocation(rideId, callback) {
        if (!this.database) {
            console.error('Firebase database not initialized');
            return;
        }

        try {
            this.database.ref(`rides/${rideId}/location`).on('value', (snapshot) => {
                const location = snapshot.val();
                if (location && callback) {
                    callback(location);
                }
            });
        } catch (error) {
            console.error('Error subscribing to location:', error);
        }
    }

    stopLocationTracking() {
        if (this.locationWatchId) {
            clearInterval(this.locationWatchId);
            this.locationWatchId = null;
        }

        if (this.rideLocationRef) {
            this.database.ref(`rides/${this.rideLocationRef}/location`).off();
            this.rideLocationRef = null;
        }
    }
}

const firebaseManager = new FirebaseManager();
window.firebaseManager = firebaseManager;
