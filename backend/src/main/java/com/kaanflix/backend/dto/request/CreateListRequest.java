package com.kaanflix.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateListRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "List name is required")
    @Size(max = 100, message = "List name must be under 100 characters")
    private String name;

    @Size(max = 500, message = "Description must be under 500 characters")
    private String description;

    private Boolean isPublic = false;
}
