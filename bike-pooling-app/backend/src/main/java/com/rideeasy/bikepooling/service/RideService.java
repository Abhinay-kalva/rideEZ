package com.rideeasy.bikepooling.service;

import com.rideeasy.bikepooling.dto.RideRequest;
import com.rideeasy.bikepooling.model.Ride;
import com.rideeasy.bikepooling.model.User;
import com.rideeasy.bikepooling.repository.RideRepository;
import com.rideeasy.bikepooling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.rideeasy.bikepooling.service.NotificationService;

@Service
public class RideService {
    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    public Ride createRide(RideRequest request) {
        User rider = userRepository.findById(request.getRiderId())
                .orElseThrow(() -> new RuntimeException("Rider not found"));

        Ride ride = new Ride();
        ride.setRider(rider);
        ride.setSourceName(request.getSourceName());
        ride.setSourceLat(request.getSourceLat());
        ride.setSourceLon(request.getSourceLon());
        ride.setDestinationName(request.getDestinationName());
        ride.setDestinationLat(request.getDestinationLat());
        ride.setDestinationLon(request.getDestinationLon());
        ride.setDate(request.getDate());
        ride.setTime(request.getTime());
        ride.setPrice(request.getPrice());
        ride.setStatus("OPEN");

        return rideRepository.save(ride);
    }

    public List<Ride> getAllOpenRides() {
        return rideRepository.findByStatus("OPEN");
    }

    public List<Ride> getRidesByRider(Long riderId) {
        return rideRepository.findByRiderId(riderId);
    }

    @Autowired
    private NotificationService notificationService;

    public Ride completeRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        ride.setStatus("COMPLETED");
        
        Ride savedRide = rideRepository.save(ride);

        // Notify all Customers with approved bookings
        for (com.rideeasy.bikepooling.model.Booking booking : ride.getBookings()) {
            if ("APPROVED".equals(booking.getStatus()) || "PENDING".equals(booking.getStatus())) { // Notify pending ones too? Maybe just approved. Let's do both for now or just approved. User said "customer should get notification". Usually only approved passengers.
                 // Correct logic: Only approved passengers took the ride.
                 if ("APPROVED".equals(booking.getStatus())) {
                     notificationService.sendNotification(
                        booking.getCustomer(),
                        "Your ride to " + ride.getDestinationName() + " is completed. Please rate your rider.",
                        "RIDE_COMPLETED"
                     );
                 }
            }
        }

        return savedRide;
    }
}
