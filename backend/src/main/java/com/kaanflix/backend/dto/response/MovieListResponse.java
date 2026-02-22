package com.kaanflix.backend.dto.response;

import java.time.LocalDateTime;

import com.kaanflix.backend.entity.MovieList;

public class MovieListResponse {

    private final Long id;
    private final String name;
    private final String description;
    private final Boolean isPublic;
    private final LocalDateTime createdAt;
    private final String username;
    private final Long userId;
    private final int movieCount;
    private final Boolean isLiked;
    private final Long likeCount;

    public MovieListResponse(Long id, String name, String description, Boolean isPublic,
                             LocalDateTime createdAt, String username, Long userId,
                             int movieCount, Boolean isLiked, Long likeCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
        this.username = username;
        this.userId = userId;
        this.movieCount = movieCount;
        this.isLiked = isLiked;
        this.likeCount = likeCount;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Boolean getIsPublic() { return isPublic; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getUsername() { return username; }
    public Long getUserId() { return userId; }
    public int getMovieCount() { return movieCount; }
    public Boolean getIsLiked() { return isLiked; }
    public Long getLikeCount() { return likeCount; }

    public static MovieListResponse from(MovieList list) {
        return new MovieListResponse(
                list.getId(),
                list.getName(),
                list.getDescription(),
                list.getIsPublic(),
                list.getCreatedAt(),
                list.getUser().getUsername(),
                list.getUser().getId(),
                list.getItems().size(),
                null,
                null
        );
    }

    public static MovieListResponse from(MovieList list, boolean isLiked, long likeCount) {
        return new MovieListResponse(
                list.getId(),
                list.getName(),
                list.getDescription(),
                list.getIsPublic(),
                list.getCreatedAt(),
                list.getUser().getUsername(),
                list.getUser().getId(),
                list.getItems().size(),
                isLiked,
                likeCount
        );
    }
}