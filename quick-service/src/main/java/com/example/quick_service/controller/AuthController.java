package com.example.quick_service.controller;

import com.example.quick_service.dto.AuthResponse;
import com.example.quick_service.dto.LoginRequest;
import com.example.quick_service.dto.SignupRequest;
import com.example.quick_service.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest req) {
        AuthResponse resp = userService.register(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        AuthResponse resp = userService.login(req);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/request-otp")
    public ResponseEntity<Void> requestOtp(@RequestParam String email) {
        userService.requestOtp(email);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestParam String email, @RequestParam String code) {
        AuthResponse resp = userService.verifyOtp(email, code);
        return ResponseEntity.ok(resp);
    }
}
