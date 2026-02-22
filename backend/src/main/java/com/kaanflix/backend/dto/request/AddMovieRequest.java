package com.kaanflix.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddMovieRequest {

    @NotNull(message = "List ID is required")
    private Long listId;

    @NotNull(message = "TMDB movie ID is required")
    private Long tmdbMovieId;

    @NotBlank(message = "Movie title is required")
    private String movieTitle;

    private String posterPath;
}