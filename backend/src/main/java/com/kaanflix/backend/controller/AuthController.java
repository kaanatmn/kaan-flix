package com.kaanflix.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaanflix.backend.dto.UserDTO;
import com.kaanflix.backend.dto.request.LoginRequest;
import com.kaanflix.backend.dto.request.RegisterRequest;
import com.kaanflix.backend.dto.response.ApiResponse;
import com.kaanflix.backend.entity.User;
import com.kaanflix.backend.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.registerUser(request.getUsername(), request.getEmail(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of("User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@Valid @RequestBody LoginRequest request) {
        User user = authService.loginUser(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(UserDTO.from(user));
    }
}
