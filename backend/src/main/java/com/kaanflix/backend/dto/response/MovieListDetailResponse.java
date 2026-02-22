package com.kaanflix.backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.kaanflix.backend.entity.MovieList;
import com.kaanflix.backend.entity.MovieListItem;

public class MovieListDetailResponse {

    private final Long id;
    private final String name;
    private final String description;
    private final Boolean isPublic;
    private final LocalDateTime createdAt;
    private final String username;
    private final Long userId;
    private final List<MovieItemResponse> movies;

    public MovieListDetailResponse(Long id, String name, String description, Boolean isPublic,
                                   LocalDateTime createdAt, String username, Long userId,
                                   List<MovieItemResponse> movies) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
        this.username = username;
        this.userId = userId;
        this.movies = movies;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Boolean getIsPublic() { return isPublic; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getUsername() { return username; }
    public Long getUserId() { return userId; }
    public List<MovieItemResponse> getMovies() { return movies; }

    public static class MovieItemResponse {

        private final Long id;
        private final Long tmdbMovieId;
        private final String movieTitle;
        private final String posterPath;
        private final LocalDateTime addedAt;

        public MovieItemResponse(Long id, Long tmdbMovieId, String movieTitle,
                                 String posterPath, LocalDateTime addedAt) {
            this.id = id;
            this.tmdbMovieId = tmdbMovieId;
            this.movieTitle = movieTitle;
            this.posterPath = posterPath;
            this.addedAt = addedAt;
        }

        public Long getId() { return id; }
        public Long getTmdbMovieId() { return tmdbMovieId; }
        public String getMovieTitle() { return movieTitle; }
        public String getPosterPath() { return posterPath; }
        public LocalDateTime getAddedAt() { return addedAt; }

        public static MovieItemResponse from(MovieListItem item) {
            return new MovieItemResponse(
                    item.getId(),
                    item.getTmdbMovieId(),
                    item.getMovieTitle(),
                    item.getPosterPath(),
                    item.getAddedAt()
            );
        }
    }

    public static MovieListDetailResponse from(MovieList list) {
        List<MovieItemResponse> movieResponses = list.getItems().stream()
                .map(MovieItemResponse::from)
                .toList();

        return new MovieListDetailResponse(
                list.getId(),
                list.getName(),
                list.getDescription(),
                list.getIsPublic(),
                list.getCreatedAt(),
                list.getUser().getUsername(),
                list.getUser().getId(),
                movieResponses
        );
    }
}