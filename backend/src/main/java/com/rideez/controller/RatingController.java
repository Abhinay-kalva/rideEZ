package com.rideez.controller;

import com.rideez.dto.RatingRequest;
import com.rideez.entity.Rating;
import com.rideez.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/ratings")
@CrossOrigin(origins = "*")
public class RatingController {
    @Autowired
    private RatingService ratingService;

    @PostMapping("/add")
    public ResponseEntity<?> addRating(@Valid @RequestBody RatingRequest request, Authentication authentication) {
        try {
            Long passengerId = (Long) authentication.getPrincipal();
            Rating rating = ratingService.addRating(passengerId, request);
            return ResponseEntity.ok(rating);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}



