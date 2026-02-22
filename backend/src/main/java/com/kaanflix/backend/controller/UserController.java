package com.kaanflix.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kaanflix.backend.dto.UserDTO;
import com.kaanflix.backend.dto.request.UpdateEmailRequest;
import com.kaanflix.backend.dto.request.UpdatePasswordRequest;
import com.kaanflix.backend.dto.request.UpdateUsernameRequest;
import com.kaanflix.backend.dto.response.ApiResponse;
import com.kaanflix.backend.entity.User;
import com.kaanflix.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/username")
    public ResponseEntity<UserDTO> updateUsername(@Valid @RequestBody UpdateUsernameRequest request) {
        User updated = userService.updateUsername(request.getUserId(), request.getNewUsername());
        return ResponseEntity.ok(UserDTO.from(updated));
    }

    @PutMapping("/email")
    public ResponseEntity<UserDTO> updateEmail(@Valid @RequestBody UpdateEmailRequest request) {
        User updated = userService.updateEmail(
                request.getUserId(), request.getCurrentPassword(), request.getNewEmail());
        return ResponseEntity.ok(UserDTO.from(updated));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse> updatePassword(@Valid @RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(
                request.getUserId(), request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(ApiResponse.of("Password updated successfully"));
    }
}
