package com.kaanflix.backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaanflix.backend.entity.User;
import com.kaanflix.backend.exception.BadRequestException;
import com.kaanflix.backend.exception.DuplicateResourceException;
import com.kaanflix.backend.exception.ResourceNotFoundException;
import com.kaanflix.backend.exception.UnauthorizedException;
import com.kaanflix.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User updateUsername(Long userId, String newUsername) {
        User user = findUserById(userId);

        if (!user.getUsername().equals(newUsername) && userRepository.existsByUsername(newUsername)) {
            throw new DuplicateResourceException("Username is already taken");
        }

        user.setUsername(newUsername);
        return userRepository.save(user);
    }

    @Transactional
    public User updateEmail(Long userId, String currentPassword, String newEmail) {
        User user = findUserById(userId);
        verifyPassword(currentPassword, user.getPassword());

        if (!user.getEmail().equals(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new DuplicateResourceException("Email is already in use");
        }

        user.setEmail(newEmail);
        return userRepository.save(user);
    }

    @Transactional
    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = findUserById(userId);
        verifyPassword(currentPassword, user.getPassword());

        if (newPassword.length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private void verifyPassword(String rawPassword, String encodedPassword) {
        if (!passwordEncoder.matches(rawPassword, encodedPassword)) {
            throw new UnauthorizedException("Incorrect password");
        }
    }
}
