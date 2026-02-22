package com.kaanflix.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kaanflix.backend.dto.request.AddMovieRequest;
import com.kaanflix.backend.dto.request.CreateListRequest;
import com.kaanflix.backend.dto.request.LikeListRequest;
import com.kaanflix.backend.dto.response.ApiResponse;
import com.kaanflix.backend.dto.response.MovieListDetailResponse;
import com.kaanflix.backend.dto.response.MovieListResponse;
import com.kaanflix.backend.service.MovieListService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/lists")
public class MovieListController {

    private final MovieListService movieListService;

    public MovieListController(MovieListService movieListService) {
        this.movieListService = movieListService;
    }

    @PostMapping
    public ResponseEntity<MovieListResponse> createList(@Valid @RequestBody CreateListRequest request) {
        MovieListResponse list = movieListService.createList(
                request.getUserId(), request.getName(),
                request.getDescription(), request.getIsPublic());
        return ResponseEntity.status(HttpStatus.CREATED).body(list);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MovieListResponse>> getUserLists(@PathVariable Long userId) {
        return ResponseEntity.ok(movieListService.getUserLists(userId));
    }

    @GetMapping("/public")
    public ResponseEntity<List<MovieListResponse>> getPublicLists(@RequestParam Long currentUserId) {
        return ResponseEntity.ok(movieListService.getPublicLists(currentUserId));
    }

    @GetMapping("/liked/{userId}")
    public ResponseEntity<List<MovieListResponse>> getLikedLists(@PathVariable Long userId) {
        return ResponseEntity.ok(movieListService.getLikedLists(userId));
    }

    @GetMapping("/{listId}")
    public ResponseEntity<MovieListDetailResponse> getListById(@PathVariable Long listId) {
        return ResponseEntity.ok(movieListService.getListById(listId));
    }

    @PostMapping("/movies")
    public ResponseEntity<ApiResponse> addMovieToList(@Valid @RequestBody AddMovieRequest request) {
        movieListService.addMovieToList(
                request.getListId(), request.getTmdbMovieId(),
                request.getMovieTitle(), request.getPosterPath());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of("Movie added to list"));
    }

    @DeleteMapping("/movies/{itemId}")
    public ResponseEntity<ApiResponse> removeMovieFromList(
            @PathVariable Long itemId, @RequestParam Long userId) {
        movieListService.removeMovieFromList(itemId, userId);
        return ResponseEntity.ok(ApiResponse.of("Movie removed from list"));
    }

    @PostMapping("/likes")
    public ResponseEntity<ApiResponse> likeList(@Valid @RequestBody LikeListRequest request) {
        movieListService.likeList(request.getUserId(), request.getListId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of("List liked"));
    }

    @DeleteMapping("/likes")
    public ResponseEntity<ApiResponse> unlikeList(
            @RequestParam Long userId, @RequestParam Long listId) {
        movieListService.unlikeList(userId, listId);
        return ResponseEntity.ok(ApiResponse.of("List unliked"));
    }

    @DeleteMapping("/{listId}")
    public ResponseEntity<ApiResponse> deleteList(
            @PathVariable Long listId, @RequestParam Long userId) {
        movieListService.deleteList(listId, userId);
        return ResponseEntity.ok(ApiResponse.of("List deleted"));
    }
}
