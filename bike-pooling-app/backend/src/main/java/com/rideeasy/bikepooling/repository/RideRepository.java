package com.rideeasy.bikepooling.repository;

import com.rideeasy.bikepooling.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByRiderId(Long riderId);
    List<Ride> findByStatus(String status);
    // Custom query methods for search can be added here
}
