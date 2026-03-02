package com.rideeasy.bikepooling.controller;

import com.rideeasy.bikepooling.model.User;
import com.rideeasy.bikepooling.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private UserService userService;

    @PutMapping("/{userId}/rate")
    public ResponseEntity<?> rateUser(@PathVariable Long userId, @RequestParam Double rating) {
        try {
            User user = userService.getUserById(userId);
            // Simple moving average calculation
            Double currentRating = user.getAverageRating() != null ? user.getAverageRating() : 5.0;
            Integer count = user.getRatingCount() != null ? user.getRatingCount() : 0;
            
            Double newRating = ((currentRating * count) + rating) / (count + 1);
            user.setAverageRating(newRating);
            user.setRatingCount(count + 1);
            
            userService.updateUser(user);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
