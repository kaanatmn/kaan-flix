package com.kaanflix.backend.dto;

import com.kaanflix.backend.entity.User;

/**
 * Safe user representation for API responses.
 * Excludes sensitive fields like password.
 */
public class UserDTO {

    private final Long id;
    private final String username;
    private final String email;

    public UserDTO(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }

    public static UserDTO from(User user) {
        return new UserDTO(user.getId(), user.getUsername(), user.getEmail());
    }
}