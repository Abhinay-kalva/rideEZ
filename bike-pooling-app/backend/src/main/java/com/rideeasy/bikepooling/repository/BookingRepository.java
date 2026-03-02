package com.rideeasy.bikepooling.repository;

import com.rideeasy.bikepooling.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByRideRiderId(Long riderId);
}
