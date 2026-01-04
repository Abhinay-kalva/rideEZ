package com.rideez.service;

import com.rideez.entity.Booking;
import com.rideez.entity.Booking.BookingStatus;
import com.rideez.entity.Ride;
import com.rideez.entity.Ride.RideStatus;
import com.rideez.entity.User;
import com.rideez.repository.BookingRepository;
import com.rideez.repository.RideRepository;
import com.rideez.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    public Booking bookRide(Long rideId, Long passengerId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if ride is available
        if (ride.getStatus() != RideStatus.CREATED) {
            throw new RuntimeException("Ride is not available for booking");
        }

        // Check if already booked
        if (bookingRepository.existsByRideAndPassengerAndBookingStatus(ride, passenger, BookingStatus.CONFIRMED)) {
            throw new RuntimeException("You have already booked this ride");
        }

        // Check available seats
        List<Booking> confirmedBookings = bookingRepository.findByRideAndBookingStatus(ride, BookingStatus.CONFIRMED);
        if (confirmedBookings.size() >= ride.getAvailableSeats()) {
            throw new RuntimeException("No seats available");
        }

        // Create booking
        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setPassenger(passenger);
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        booking = bookingRepository.save(booking);

        // Update ride status to BOOKED if this is the first booking
        if (confirmedBookings.isEmpty()) {
            ride.setStatus(RideStatus.BOOKED);
            rideRepository.save(ride);
        }

        return booking;
    }

    public List<Booking> getPassengerBookings(Long passengerId) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByPassenger(passenger);
    }

    public List<Booking> getRideBookings(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        return bookingRepository.findByRide(ride);
    }
}



