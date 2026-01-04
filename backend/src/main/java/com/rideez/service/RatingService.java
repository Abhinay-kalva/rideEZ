package com.rideez.service;

import com.rideez.dto.RatingRequest;
import com.rideez.entity.Booking;
import com.rideez.entity.Booking.BookingStatus;
import com.rideez.entity.Rating;
import com.rideez.entity.Ride;
import com.rideez.entity.Ride.RideStatus;
import com.rideez.entity.User;
import com.rideez.repository.BookingRepository;
import com.rideez.repository.RatingRepository;
import com.rideez.repository.RideRepository;
import com.rideez.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private RideRepository rideRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Rating addRating(Long passengerId, RatingRequest request) {
        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User rider = ride.getRider();

        // Check if ride is completed
        if (ride.getStatus() != RideStatus.COMPLETED) {
            throw new RuntimeException("Can only rate completed rides");
        }

        // Check if passenger has booked this ride
        Optional<Booking> bookingOpt = bookingRepository.findByRideAndPassenger(ride, passenger);
        if (bookingOpt.isEmpty() || bookingOpt.get().getBookingStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("You can only rate rides you have booked");
        }

        // Check if already rated
        Optional<Rating> existingRatingOpt = ratingRepository.findByRideAndPassenger(ride, passenger);
        if (existingRatingOpt.isPresent()) {
            throw new RuntimeException("You have already rated this ride");
        }

        // Create rating
        Rating rating = new Rating();
        rating.setRide(ride);
        rating.setRider(rider);
        rating.setPassenger(passenger);
        rating.setRating(request.getRating());
        rating.setReview(request.getReview());

        rating = ratingRepository.save(rating);

        // Update rider's average rating
        Double averageRating = ratingRepository.calculateAverageRating(rider);
        if (averageRating != null) {
            rider.setRating(averageRating);
            userRepository.save(rider);
        }

        return rating;
    }
}



