package com.rideez.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rider_id", nullable = false)
    private User rider;

    @NotNull
    @Column(nullable = false)
    private Double sourceLat;

    @NotNull
    @Column(nullable = false)
    private Double sourceLng;

    @Column(length = 500)
    private String sourceAddress;

    @NotNull
    @Column(nullable = false)
    private Double destLat;

    @NotNull
    @Column(nullable = false)
    private Double destLng;

    @Column(length = 500)
    private String destAddress;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime dateTime;

    @NotNull
    @Column(nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RideStatus status = RideStatus.CREATED;

    @Column(nullable = false)
    private Integer availableSeats = 1;

    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL)
    private java.util.List<Booking> bookings;

    // Constructors
    public Ride() {}

    public Ride(User rider, Double sourceLat, Double sourceLng, Double destLat, Double destLng, 
                LocalDateTime dateTime, Double price) {
        this.rider = rider;
        this.sourceLat = sourceLat;
        this.sourceLng = sourceLng;
        this.destLat = destLat;
        this.destLng = destLng;
        this.dateTime = dateTime;
        this.price = price;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getRider() {
        return rider;
    }

    public void setRider(User rider) {
        this.rider = rider;
    }

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

    public RideStatus getStatus() {
        return status;
    }

    public void setStatus(RideStatus status) {
        this.status = status;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public java.util.List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(java.util.List<Booking> bookings) {
        this.bookings = bookings;
    }

    public enum RideStatus {
        CREATED, BOOKED, ONGOING, COMPLETED, CANCELLED
    }
}



