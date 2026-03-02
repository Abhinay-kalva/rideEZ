const API_URL = "http://localhost:8080/api";

export async function loginUser(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Login failed");
    }
    return response.json();
}

export async function registerUser(email, password, name, role) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Registration failed");
    }
    return response.json();
}

export async function createRide(rideData) {
    const response = await fetch(`${API_URL}/rides/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rideData),
    });
    if (!response.ok) throw new Error("Failed to create ride");
    return response.json();
}

export async function getOpenRides() {
    const response = await fetch(`${API_URL}/rides/open`);
    if (!response.ok) throw new Error("Failed to fetch rides");
    return response.json();
}

export async function getRidesByRider(riderId) {
    const response = await fetch(`${API_URL}/rides/rider/${riderId}`);
    if (!response.ok) throw new Error("Failed to fetch your rides");
    return response.json();
}

export async function createBooking(bookingData) {
    const response = await fetch(`${API_URL}/bookings/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error("Failed to book ride");
    return response.json();
}

export async function getBookingsByCustomer(customerId) {
    const response = await fetch(`${API_URL}/bookings/customer/${customerId}`);
    if (!response.ok) throw new Error("Failed to fetch bookings");
    return response.json();
}

export async function updateBookingStatus(bookingId, status) {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/status?status=${status}`, {
        method: "PUT"
    });
    if (!response.ok) throw new Error("Failed to update status");
    return response.json();
}

export async function completeRide(rideId) {
    const response = await fetch(`${API_URL}/rides/${rideId}/complete`, {
        method: "PUT"
    });
    if (!response.ok) throw new Error("Failed to complete ride");
    return response.json();
}

export async function rateUser(userId, rating) {
    const response = await fetch(`${API_URL}/users/${userId}/rate?rating=${rating}`, {
        method: "PUT"
    });
    if (!response.ok) throw new Error("Failed to rate user");
    return response.json();
}
export async function getRiderBookings(riderId) {
    const response = await fetch(`${API_URL}/bookings/rider/${riderId}`);
    if (!response.ok) throw new Error("Failed to fetch rider bookings");
    return response.json();
}



export async function getNotifications(userId) {
    const response = await fetch(`${API_URL}/notifications/user/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch notifications");
    return response.json();
}

export async function markNotificationRead(notificationId) {
    const response = await fetch(`${API_URL}/notifications/${notificationId}/read`, {
        method: "PUT"
    });
    if (!response.ok) throw new Error("Failed to mark as read");
    return response.text();
}
