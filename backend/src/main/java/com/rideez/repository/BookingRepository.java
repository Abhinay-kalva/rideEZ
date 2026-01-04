package com.rideez.repository;

import com.rideez.entity.Booking;
import com.rideez.entity.Booking.BookingStatus;
import com.rideez.entity.Ride;
import com.rideez.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPassenger(User passenger);
    List<Booking> findByRide(Ride ride);
    Optional<Booking> findByRideAndPassenger(Ride ride, User passenger);
    List<Booking> findByRideAndBookingStatus(Ride ride, BookingStatus status);
    boolean existsByRideAndPassengerAndBookingStatus(Ride ride, User passenger, BookingStatus status);
}



