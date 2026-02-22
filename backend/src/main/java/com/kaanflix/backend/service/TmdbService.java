package com.kaanflix.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class TmdbService {

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.base-url}")
    private String baseUrl;

    @Value("${tmdb.api.key}")
    private String apiKey;

    public TmdbService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getPopularMovies() {
        String url = UriComponentsBuilder.fromUriString(baseUrl + "movie/popular")
                .queryParam("api_key", apiKey)
                .toUriString();
        return restTemplate.getForObject(url, String.class);
    }

    public String searchMovies(String query) {
        String url = UriComponentsBuilder.fromUriString(baseUrl + "search/movie")
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .toUriString();
        return restTemplate.getForObject(url, String.class);
    }

    public String getMovieDetails(Long movieId) {
        String url = UriComponentsBuilder.fromUriString(baseUrl + "movie/" + movieId)
                .queryParam("api_key", apiKey)
                .queryParam("append_to_response", "credits,videos")
                .toUriString();
        return restTemplate.getForObject(url, String.class);
    }
}
