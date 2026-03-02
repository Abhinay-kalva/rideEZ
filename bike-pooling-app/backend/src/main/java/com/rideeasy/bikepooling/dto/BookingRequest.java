package com.rideeasy.bikepooling.dto;

public class BookingRequest {
    private Long rideId;
    private Long customerId;

    // Getters and Setters
    public Long getRideId() { return rideId; }
    public void setRideId(Long rideId) { this.rideId = rideId; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
}
