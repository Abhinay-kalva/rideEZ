package com.rideez.controller;

import com.rideez.dto.RideRequest;
import com.rideez.entity.Ride;
import com.rideez.service.RideService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rides")
@CrossOrigin(origins = "*")
public class RideController {
    @Autowired
    private RideService rideService;

    @PostMapping("/create")
    public ResponseEntity<?> createRide(@Valid @RequestBody RideRequest request, Authentication authentication) {
        try {
            Long riderId = (Long) authentication.getPrincipal();
            Ride ride = rideService.createRide(riderId, request);
            return ResponseEntity.ok(ride);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchRides(
            @RequestParam(required = false) Double sourceLat,
            @RequestParam(required = false) Double sourceLng,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) {
        try {
            List<Ride> rides = rideService.searchRides(sourceLat, sourceLng, dateTime);
            return ResponseEntity.ok(rides);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-rides")
    public ResponseEntity<?> getMyRides(Authentication authentication) {
        try {
            Long riderId = (Long) authentication.getPrincipal();
            List<Ride> rides = rideService.getRiderRides(riderId);
            return ResponseEntity.ok(rides);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRideById(@PathVariable Long id) {
        try {
            Ride ride = rideService.getRideById(id);
            return ResponseEntity.ok(ride);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<?> startRide(@PathVariable Long id, Authentication authentication) {
        try {
            Long riderId = (Long) authentication.getPrincipal();
            Ride ride = rideService.startRide(id, riderId);
            return ResponseEntity.ok(ride);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<?> endRide(@PathVariable Long id, Authentication authentication) {
        try {
            Long riderId = (Long) authentication.getPrincipal();
            Ride ride = rideService.endRide(id, riderId);
            return ResponseEntity.ok(ride);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}



