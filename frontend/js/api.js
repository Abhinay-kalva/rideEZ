// API Service
class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const token = localStorage.getItem('token');

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth APIs
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    // Ride APIs
    async createRide(rideData) {
        return this.request('/rides/create', {
            method: 'POST',
            body: JSON.stringify(rideData)
        });
    }

    async searchRides(sourceLat, sourceLng, dateTime) {
        const params = new URLSearchParams();
        if (sourceLat) params.append('sourceLat', sourceLat);
        if (sourceLng) params.append('sourceLng', sourceLng);
        params.append('dateTime', dateTime);
        return this.request(`/rides/search?${params.toString()}`);
    }

    async getMyRides() {
        return this.request('/rides/my-rides');
    }

    async getRideById(id) {
        return this.request(`/rides/${id}`);
    }

    async startRide(id) {
        return this.request(`/rides/${id}/start`, { method: 'POST' });
    }

    async endRide(id) {
        return this.request(`/rides/${id}/end`, { method: 'POST' });
    }

    // Booking APIs
    async bookRide(rideId) {
        return this.request(`/bookings/book/${rideId}`, { method: 'POST' });
    }

    async getMyBookings() {
        return this.request('/bookings/my-bookings');
    }

    // Rating APIs
    async addRating(ratingData) {
        return this.request('/ratings/add', {
            method: 'POST',
            body: JSON.stringify(ratingData)
        });
    }
}

const api = new ApiService(CONFIG.API_BASE_URL);



