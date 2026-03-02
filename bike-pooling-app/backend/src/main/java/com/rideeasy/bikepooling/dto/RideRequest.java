package com.rideeasy.bikepooling.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class RideRequest {
    private Long riderId;
    private String sourceName;
    private Double sourceLat;
    private Double sourceLon;
    private String destinationName;
    private Double destinationLat;
    private Double destinationLon;
    private LocalDate date;
    private LocalTime time;
    private Double price;

    // Getters and Setters
    public Long getRiderId() { return riderId; }
    public void setRiderId(Long riderId) { this.riderId = riderId; }
    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }
    public Double getSourceLat() { return sourceLat; }
    public void setSourceLat(Double sourceLat) { this.sourceLat = sourceLat; }
    public Double getSourceLon() { return sourceLon; }
    public void setSourceLon(Double sourceLon) { this.sourceLon = sourceLon; }
    public String getDestinationName() { return destinationName; }
    public void setDestinationName(String destinationName) { this.destinationName = destinationName; }
    public Double getDestinationLat() { return destinationLat; }
    public void setDestinationLat(Double destinationLat) { this.destinationLat = destinationLat; }
    public Double getDestinationLon() { return destinationLon; }
    public void setDestinationLon(Double destinationLon) { this.destinationLon = destinationLon; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}
