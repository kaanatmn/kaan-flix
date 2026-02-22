package com.kaanflix.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LikeListRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "List ID is required")
    private Long listId;
}