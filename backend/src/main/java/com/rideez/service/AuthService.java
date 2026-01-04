package com.rideez.service;

import com.rideez.dto.AuthResponse;
import com.rideez.dto.LoginRequest;
import com.rideez.dto.RegisterRequest;
import com.rideez.entity.User;
import com.rideez.repository.UserRepository;
import com.rideez.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        // Check if phone already exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number already registered");
        }

        // Check if email already exists (if provided)
        if (request.getEmail() != null && !request.getEmail().isEmpty() 
            && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setRating(0.0);

        user = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getPhone(), user.getId(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getName(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest request) {
        // Find user by phone or email
        Optional<User> userOpt = userRepository.findByPhone(request.getPhoneOrEmail());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getPhoneOrEmail());
        }

        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getPhone(), user.getId(), user.getRole().name());

        return new AuthResponse(token, user.getId(), user.getName(), user.getRole().name());
    }
}



