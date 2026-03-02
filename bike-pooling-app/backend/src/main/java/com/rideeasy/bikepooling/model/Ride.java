package com.rideeasy.bikepooling.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rides")
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rider_id", nullable = false)
    private User rider;

    private String sourceName;
    private Double sourceLat;
    private Double sourceLon;

    private String destinationName;
    private Double destinationLat;
    private Double destinationLon;

    private LocalDate date;
    private LocalTime time;
    private Double price;

    private String status; // OPEN, COMPLETED, CANCELLED

    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Booking> bookings = new ArrayList<>();

    public Ride() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getRider() { return rider; }
    public void setRider(User rider) { this.rider = rider; }
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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}
