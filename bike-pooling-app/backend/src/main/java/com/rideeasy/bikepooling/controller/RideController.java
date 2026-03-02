package com.rideeasy.bikepooling.controller;

import com.rideeasy.bikepooling.dto.RideRequest;
import com.rideeasy.bikepooling.model.Ride;
import com.rideeasy.bikepooling.service.RideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "http://localhost:5173")
public class RideController {
    @Autowired
    private RideService rideService;

    @PostMapping("/create")
    public ResponseEntity<?> createRide(@RequestBody RideRequest request) {
        try {
            Ride ride = rideService.createRide(request);
            return ResponseEntity.ok(ride);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/open")
    public ResponseEntity<List<Ride>> getOpenRides() {
        return ResponseEntity.ok(rideService.getAllOpenRides());
    }

    @GetMapping("/rider/{riderId}")
    public ResponseEntity<List<Ride>> getRidesByRider(@PathVariable Long riderId) {
        return ResponseEntity.ok(rideService.getRidesByRider(riderId));
    }

    @PutMapping("/{rideId}/complete")
    public ResponseEntity<?> completeRide(@PathVariable Long rideId) {
        try {
            return ResponseEntity.ok(rideService.completeRide(rideId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
