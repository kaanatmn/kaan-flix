package com.kaanflix.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUsernameRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "New username is required")
    @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
    private String newUsername;
}