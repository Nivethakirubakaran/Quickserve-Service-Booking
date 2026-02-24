package com.example.quick_service.service;

import com.example.quick_service.dto.AuthResponse;
import com.example.quick_service.dto.LoginRequest;
import com.example.quick_service.dto.SignupRequest;
import com.example.quick_service.model.User;
import com.example.quick_service.repository.UserRepository;
import com.example.quick_service.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(SignupRequest req) {
        Optional<User> existing = userRepository.findByEmail(req.getEmail());
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        String hash = passwordEncoder.encode(req.getPassword());
        User u = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(hash)
                .role("ROLE_USER")
                .build();

        userRepository.save(u);

        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(u.getEmail(), u.getPasswordHash(), java.util.List.of());
        String jwt = jwtUtil.generateToken(userDetails);
        Instant expiry = Instant.now().plus(7, ChronoUnit.DAYS);
        return new AuthResponse(jwt, expiry);
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPasswordHash(), java.util.List.of());
        String jwt = jwtUtil.generateToken(userDetails);
        Instant expiry = Instant.now().plus(7, ChronoUnit.DAYS);
        return new AuthResponse(jwt, expiry);
    }

    // OTP: generate and store OTP for a given email (simulate sending)
    @Transactional
    public void requestOtp(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
        String code = String.format("%06d", (int)(Math.random() * 1_000_000));
        user.setOtpCode(code);
        user.setOtpExpiry(Instant.now().plus(5, ChronoUnit.MINUTES));
        userRepository.save(user);
        // In real system send via SMS/Email. Here we store it so tests/dev can retrieve it.
        System.out.println("OTP for " + email + " = " + code);
    }

    @Transactional
    public AuthResponse verifyOtp(String email, String code) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (user.getOtpCode() == null || user.getOtpExpiry() == null || Instant.now().isAfter(user.getOtpExpiry())) {
            throw new IllegalArgumentException("OTP expired or not requested");
        }
        if (!user.getOtpCode().equals(code)) {
            throw new IllegalArgumentException("Invalid OTP");
        }
        // clear otp
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        org.springframework.security.core.userdetails.User userDetails = new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPasswordHash(), java.util.List.of());
        String jwt = jwtUtil.generateToken(userDetails);
        Instant expiry = Instant.now().plus(7, ChronoUnit.DAYS);
        return new AuthResponse(jwt, expiry);
    }
}
