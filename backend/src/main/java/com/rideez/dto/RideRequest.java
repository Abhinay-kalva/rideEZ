package com.rideez.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class RideRequest {
    @NotNull(message = "Source latitude is required")
    private Double sourceLat;

    @NotNull(message = "Source longitude is required")
    private Double sourceLng;

    private String sourceAddress;

    @NotNull(message = "Destination latitude is required")
    private Double destLat;

    @NotNull(message = "Destination longitude is required")
    private Double destLng;

    private String destAddress;

    @NotNull(message = "Date and time is required")
    private LocalDateTime dateTime;

    @NotNull(message = "Price is required")
    private Double price;

    public RideRequest() {}

    // Getters and Setters
    public Double getSourceLat() {
        return sourceLat;
    }

    public void setSourceLat(Double sourceLat) {
        this.sourceLat = sourceLat;
    }

    public Double getSourceLng() {
        return sourceLng;
    }

    public void setSourceLng(Double sourceLng) {
        this.sourceLng = sourceLng;
    }

    public String getSourceAddress() {
        return sourceAddress;
    }

    public void setSourceAddress(String sourceAddress) {
        this.sourceAddress = sourceAddress;
    }

    public Double getDestLat() {
        return destLat;
    }

    public void setDestLat(Double destLat) {
        this.destLat = destLat;
    }

    public Double getDestLng() {
        return destLng;
    }

    public void setDestLng(Double destLng) {
        this.destLng = destLng;
    }

    public String getDestAddress() {
        return destAddress;
    }

    public void setDestAddress(String destAddress) {
        this.destAddress = destAddress;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}



