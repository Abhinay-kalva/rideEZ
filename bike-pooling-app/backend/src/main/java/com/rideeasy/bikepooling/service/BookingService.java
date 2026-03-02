package com.rideeasy.bikepooling.service;

import com.rideeasy.bikepooling.dto.BookingRequest;
import com.rideeasy.bikepooling.model.Booking;
import com.rideeasy.bikepooling.model.Ride;
import com.rideeasy.bikepooling.model.User;
import com.rideeasy.bikepooling.repository.BookingRepository;
import com.rideeasy.bikepooling.repository.RideRepository;
import com.rideeasy.bikepooling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.rideeasy.bikepooling.service.NotificationService;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public Booking createBooking(BookingRequest request) {
        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setCustomer(customer);
        booking.setStatus("PENDING");
        
        Booking savedBooking = bookingRepository.save(booking);

        // Notify Rider
        notificationService.sendNotification(
            ride.getRider(),
            "New booking request from " + customer.getName() + " for your ride to " + ride.getDestinationName(),
            "BOOKING_REQUEST"
        );

        return savedBooking;
    }

    public Booking updateBookingStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        
        Booking savedBooking = bookingRepository.save(booking);

        // Notify Customer
        String message = "Your booking for " + booking.getRide().getDestinationName() + " has been " + status;
        notificationService.sendNotification(
            booking.getCustomer(),
            message,
            "BOOKING_UPDATE"
        );

        return savedBooking;
    }

    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    public List<Booking> getBookingsForRider(Long riderId) {
        return bookingRepository.findByRideRiderId(riderId);
    }
}
