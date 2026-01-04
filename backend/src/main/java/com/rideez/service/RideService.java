package com.rideez.service;

import com.rideez.dto.RideRequest;
import com.rideez.entity.Ride;
import com.rideez.entity.Ride.RideStatus;
import com.rideez.entity.User;
import com.rideez.repository.RideRepository;
import com.rideez.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RideService {
    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    public Ride createRide(Long riderId, RideRequest request) {
        User rider = userRepository.findById(riderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Ride ride = new Ride();
        ride.setRider(rider);
        ride.setSourceLat(request.getSourceLat());
        ride.setSourceLng(request.getSourceLng());
        ride.setSourceAddress(request.getSourceAddress());
        ride.setDestLat(request.getDestLat());
        ride.setDestLng(request.getDestLng());
        ride.setDestAddress(request.getDestAddress());
        ride.setDateTime(request.getDateTime());
        ride.setPrice(request.getPrice());
        ride.setStatus(RideStatus.CREATED);
        ride.setAvailableSeats(1);

        return rideRepository.save(ride);
    }

    public List<Ride> searchRides(Double sourceLat, Double sourceLng, LocalDateTime dateTime) {
        List<RideStatus> availableStatuses = Arrays.asList(RideStatus.CREATED, RideStatus.BOOKED);
        
        // Get all available rides for the date
        List<Ride> rides = rideRepository.findAvailableRidesWithDate(availableStatuses, dateTime);
        
        // Filter by location if provided (simple bounding box - can be enhanced with haversine formula)
        if (sourceLat != null && sourceLng != null) {
            // Approximate 50km radius as ~0.45 degrees (roughly)
            final double radius = 0.45;
            rides = rides.stream()
                .filter(ride -> {
                    double latDiff = Math.abs(ride.getSourceLat() - sourceLat);
                    double lngDiff = Math.abs(ride.getSourceLng() - sourceLng);
                    return latDiff <= radius && lngDiff <= radius;
                })
                .collect(Collectors.toList());
        }
        
        return rides;
    }

    public List<Ride> getRiderRides(Long riderId) {
        User rider = userRepository.findById(riderId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return rideRepository.findByRider(rider);
    }

    public Ride getRideById(Long rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
    }

    public Ride startRide(Long rideId, Long riderId) {
        Ride ride = getRideById(rideId);
        
        if (!ride.getRider().getId().equals(riderId)) {
            throw new RuntimeException("Only the rider can start this ride");
        }

        if (ride.getStatus() != RideStatus.BOOKED && ride.getStatus() != RideStatus.CREATED) {
            throw new RuntimeException("Ride cannot be started in current status");
        }

        ride.setStatus(RideStatus.ONGOING);
        return rideRepository.save(ride);
    }

    public Ride endRide(Long rideId, Long riderId) {
        Ride ride = getRideById(rideId);
        
        if (!ride.getRider().getId().equals(riderId)) {
            throw new RuntimeException("Only the rider can end this ride");
        }

        if (ride.getStatus() != RideStatus.ONGOING) {
            throw new RuntimeException("Only ongoing rides can be ended");
        }

        ride.setStatus(RideStatus.COMPLETED);
        return rideRepository.save(ride);
    }
}

