package com.kaanflix.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kaanflix.backend.dto.response.MovieListDetailResponse;
import com.kaanflix.backend.dto.response.MovieListResponse;
import com.kaanflix.backend.entity.ListLike;
import com.kaanflix.backend.entity.MovieList;
import com.kaanflix.backend.entity.MovieListItem;
import com.kaanflix.backend.entity.User;
import com.kaanflix.backend.exception.BadRequestException;
import com.kaanflix.backend.exception.DuplicateResourceException;
import com.kaanflix.backend.exception.ResourceNotFoundException;
import com.kaanflix.backend.exception.UnauthorizedException;
import com.kaanflix.backend.repository.ListLikeRepository;
import com.kaanflix.backend.repository.MovieListItemRepository;
import com.kaanflix.backend.repository.MovieListRepository;
import com.kaanflix.backend.repository.UserRepository;

@Service
public class MovieListService {

    private final MovieListRepository movieListRepository;
    private final MovieListItemRepository movieListItemRepository;
    private final ListLikeRepository listLikeRepository;
    private final UserRepository userRepository;

    public MovieListService(
            MovieListRepository movieListRepository,
            MovieListItemRepository movieListItemRepository,
            ListLikeRepository listLikeRepository,
            UserRepository userRepository) {
        this.movieListRepository = movieListRepository;
        this.movieListItemRepository = movieListItemRepository;
        this.listLikeRepository = listLikeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public MovieListResponse createList(Long userId, String name, String description, Boolean isPublic) {
        User user = findUserById(userId);

        MovieList list = new MovieList();
        list.setName(name);
        list.setDescription(description);
        list.setIsPublic(isPublic != null ? isPublic : false);
        list.setUser(user);

        MovieList saved = movieListRepository.save(list);
        return MovieListResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<MovieListResponse> getUserLists(Long userId) {
        return movieListRepository.findByUserId(userId).stream()
                .map(MovieListResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MovieListResponse> getPublicLists(Long currentUserId) {
        return movieListRepository.findByIsPublicTrue().stream()
                .map(list -> {
                    boolean isLiked = listLikeRepository.existsByUserIdAndMovieListId(currentUserId, list.getId());
                    long likeCount = listLikeRepository.countByMovieListId(list.getId());
                    return MovieListResponse.from(list, isLiked, likeCount);
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MovieListResponse> getLikedLists(Long userId) {
        return listLikeRepository.findByUserId(userId).stream()
                .map(like -> MovieListResponse.from(like.getMovieList()))
                .toList();
    }

    @Transactional(readOnly = true)
    public MovieListDetailResponse getListById(Long listId) {
        MovieList list = findListById(listId);
        return MovieListDetailResponse.from(list);
    }

    @Transactional
    public MovieListItem addMovieToList(Long listId, Long tmdbMovieId, String movieTitle, String posterPath) {
        MovieList list = findListById(listId);

        if (movieListItemRepository.existsByMovieListIdAndTmdbMovieId(listId, tmdbMovieId)) {
            throw new DuplicateResourceException("Movie is already in this list");
        }

        MovieListItem item = new MovieListItem();
        item.setMovieList(list);
        item.setTmdbMovieId(tmdbMovieId);
        item.setMovieTitle(movieTitle);
        item.setPosterPath(posterPath);

        return movieListItemRepository.save(item);
    }

    @Transactional
    public void removeMovieFromList(Long itemId, Long userId) {
        MovieListItem item = movieListItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie list item", "id", itemId));

        if (!item.getMovieList().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only remove movies from your own lists");
        }

        movieListItemRepository.delete(item);
    }

    @Transactional
    public void likeList(Long userId, Long listId) {
        User user = findUserById(userId);
        MovieList list = findListById(listId);

        if (list.getUser().getId().equals(userId)) {
            throw new BadRequestException("You cannot like your own list");
        }

        if (!list.getIsPublic()) {
            throw new BadRequestException("You can only like public lists");
        }

        if (listLikeRepository.existsByUserIdAndMovieListId(userId, listId)) {
            throw new DuplicateResourceException("You have already liked this list");
        }

        ListLike like = new ListLike();
        like.setUser(user);
        like.setMovieList(list);
        listLikeRepository.save(like);
    }

    @Transactional
    public void unlikeList(Long userId, Long listId) {
        ListLike like = listLikeRepository.findByUserIdAndMovieListId(userId, listId)
                .orElseThrow(() -> new ResourceNotFoundException("Like not found"));

        listLikeRepository.delete(like);
    }

    @Transactional
    public void deleteList(Long listId, Long userId) {
        MovieList list = findListById(listId);

        if (!list.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own lists");
        }

        movieListRepository.delete(list);
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    private MovieList findListById(Long listId) {
        return movieListRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie list", "id", listId));
    }
}
