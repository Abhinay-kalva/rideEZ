package com.rideez.controller;

import com.rideez.entity.Booking;
import com.rideez.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/book/{rideId}")
    public ResponseEntity<?> bookRide(@PathVariable Long rideId, Authentication authentication) {
        try {
            Long passengerId = (Long) authentication.getPrincipal();
            Booking booking = bookingService.bookRide(rideId, passengerId);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        try {
            Long passengerId = (Long) authentication.getPrincipal();
            List<Booking> bookings = bookingService.getPassengerBookings(passengerId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/ride/{rideId}")
    public ResponseEntity<?> getRideBookings(@PathVariable Long rideId) {
        try {
            List<Booking> bookings = bookingService.getRideBookings(rideId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}



