package com.rideez.repository;

import com.rideez.entity.Ride;
import com.rideez.entity.Ride.RideStatus;
import com.rideez.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByRider(User rider);
    List<Ride> findByStatus(RideStatus status);
    
    // Note: For production, consider using a spatial database extension or calculate distance in service layer
    @Query("SELECT r FROM Ride r WHERE r.status IN :statuses AND r.dateTime >= :dateTime")
    List<Ride> findAvailableRidesWithDate(@Param("statuses") List<RideStatus> statuses, 
                                          @Param("dateTime") LocalDateTime dateTime);
}

