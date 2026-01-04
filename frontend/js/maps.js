// Google Maps Integration
class MapsManager {
    constructor() {
        this.riderMap = null;
        this.passengerMap = null;
        this.sourceMap = null;
        this.destMap = null;
        this.sourceMarker = null;
        this.destMarker = null;
        this.directionsService = null;
        this.directionsRenderer = null;
        this.autocomplete = null;
    }

    initMaps() {
        // Initialize Rider Map
        if (document.getElementById('rider-map')) {
            this.riderMap = new google.maps.Map(document.getElementById('rider-map'), {
                zoom: 13,
                center: { lat: 28.6139, lng: 77.2090 }, // Default: New Delhi
                mapTypeControl: false,
                fullscreenControl: true
            });
        }

        // Initialize Passenger Map
        if (document.getElementById('passenger-map')) {
            this.passengerMap = new google.maps.Map(document.getElementById('passenger-map'), {
                zoom: 13,
                center: { lat: 28.6139, lng: 77.2090 },
                mapTypeControl: false,
                fullscreenControl: true
            });
        }

        // Initialize Source Map (for create ride modal)
        if (document.getElementById('source-map')) {
            this.sourceMap = new google.maps.Map(document.getElementById('source-map'), {
                zoom: 13,
                center: { lat: 28.6139, lng: 77.2090 },
                mapTypeControl: false
            });

            this.sourceMap.addListener('click', (e) => {
                this.setSourceLocation(e.latLng.lat(), e.latLng.lng());
            });
        }

        // Initialize Destination Map
        if (document.getElementById('dest-map')) {
            this.destMap = new google.maps.Map(document.getElementById('dest-map'), {
                zoom: 13,
                center: { lat: 28.6139, lng: 77.2090 },
                mapTypeControl: false
            });

            this.destMap.addListener('click', (e) => {
                this.setDestLocation(e.latLng.lat(), e.latLng.lng());
            });
        }

        // Initialize Directions Service
        this.directionsService = new google.maps.DirectionsService();
        
        // Setup autocomplete for address inputs
        this.setupAutocomplete();
        
        // Get user's current location
        this.getCurrentLocation();
    }

    setupAutocomplete() {
        const sourceInput = document.getElementById('sourceAddress');
        const destInput = document.getElementById('destAddress');

        if (sourceInput && google.maps.places) {
            const sourceAutocomplete = new google.maps.places.Autocomplete(sourceInput);
            sourceAutocomplete.bindTo('bounds', this.sourceMap);
            sourceAutocomplete.addListener('place_changed', () => {
                const place = sourceAutocomplete.getPlace();
                if (place.geometry) {
                    this.setSourceLocation(place.geometry.location.lat(), place.geometry.location.lng());
                    this.sourceMap.setCenter(place.geometry.location);
                    this.sourceMap.setZoom(15);
                }
            });
        }

        if (destInput && google.maps.places) {
            const destAutocomplete = new google.maps.places.Autocomplete(destInput);
            destAutocomplete.bindTo('bounds', this.destMap);
            destAutocomplete.addListener('place_changed', () => {
                const place = destAutocomplete.getPlace();
                if (place.geometry) {
                    this.setDestLocation(place.geometry.location.lat(), place.geometry.location.lng());
                    this.destMap.setCenter(place.geometry.location);
                    this.destMap.setZoom(15);
                }
            });
        }
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                if (this.riderMap) {
                    this.riderMap.setCenter(location);
                    this.riderMap.setZoom(15);
                }

                if (this.passengerMap) {
                    this.passengerMap.setCenter(location);
                    this.passengerMap.setZoom(15);
                }

                if (this.sourceMap) {
                    this.sourceMap.setCenter(location);
                    this.setSourceLocation(location.lat, location.lng);
                }
            });
        }
    }

    setSourceLocation(lat, lng) {
        document.getElementById('sourceLat').value = lat;
        document.getElementById('sourceLng').value = lng;

        if (this.sourceMarker) {
            this.sourceMarker.setMap(null);
        }

        this.sourceMarker = new google.maps.Marker({
            position: { lat, lng },
            map: this.sourceMap,
            title: 'Source',
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }
        });

        // Reverse geocode to get address
        this.reverseGeocode(lat, lng, (address) => {
            document.getElementById('sourceAddress').value = address;
        });
    }

    setDestLocation(lat, lng) {
        document.getElementById('destLat').value = lat;
        document.getElementById('destLng').value = lng;

        if (this.destMarker) {
            this.destMarker.setMap(null);
        }

        this.destMarker = new google.maps.Marker({
            position: { lat, lng },
            map: this.destMap,
            title: 'Destination',
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
        });

        // Reverse geocode to get address
        this.reverseGeocode(lat, lng, (address) => {
            document.getElementById('destAddress').value = address;
        });
    }

    reverseGeocode(lat, lng, callback) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === 'OK' && results[0]) {
                callback(results[0].formatted_address);
            }
        });
    }

    drawRoute(map, origin, destination) {
        if (!this.directionsService) return;

        const directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: false
        });

        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING
        }, (result, status) => {
            if (status === 'OK') {
                directionsRenderer.setDirections(result);
            }
        });
    }

    addMarker(map, position, title, iconUrl) {
        return new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            icon: iconUrl ? { url: iconUrl } : null
        });
    }

    showRidesOnMap(rides) {
        if (!this.passengerMap) return;

        // Clear existing markers
        if (this.rideMarkers) {
            this.rideMarkers.forEach(marker => marker.setMap(null));
        }
        this.rideMarkers = [];

        rides.forEach(ride => {
            const marker = this.addMarker(
                this.passengerMap,
                { lat: ride.sourceLat, lng: ride.sourceLng },
                `${ride.rider.name} - ₹${ride.price}`,
                'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            );

            marker.addListener('click', () => {
                if (window.app) {
                    window.app.showRideDetails(ride);
                }
            });

            this.rideMarkers.push(marker);
        });
    }

    updateRiderLocation(lat, lng) {
        if (!this.riderMap) return;

        if (this.riderLocationMarker) {
            this.riderLocationMarker.setPosition({ lat, lng });
        } else {
            this.riderLocationMarker = this.addMarker(
                this.riderMap,
                { lat, lng },
                'Your Location',
                'http://maps.google.com/mapfiles/ms/icons/cycling.png'
            );
        }

        this.riderMap.setCenter({ lat, lng });
    }
}

// Global function for Google Maps callback
function initMaps() {
    if (window.mapsManager) {
        window.mapsManager.initMaps();
    }
}

const mapsManager = new MapsManager();
window.mapsManager = mapsManager;



