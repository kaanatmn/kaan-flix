package com.kaanflix.backend.dto.response;

public class ApiResponse {

    private final String message;

    public ApiResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public static ApiResponse of(String message) {
        return new ApiResponse(message);
    }
}