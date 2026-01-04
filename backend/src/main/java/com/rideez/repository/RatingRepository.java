package com.rideez.repository;

import com.rideez.entity.Rating;
import com.rideez.entity.Ride;
import com.rideez.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByRider(User rider);
    List<Rating> findByRide(Ride ride);
    Optional<Rating> findByRideAndPassenger(Ride ride, User passenger);
    
    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.rider = :rider")
    Double calculateAverageRating(@Param("rider") User rider);
}



