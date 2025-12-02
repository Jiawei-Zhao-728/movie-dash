package com.moviedash.controller;

import com.moviedash.dto.request.FavoriteRequest;
import com.moviedash.dto.response.ApiResponse;
import com.moviedash.entity.Favorite;
import com.moviedash.entity.User;
import com.moviedash.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * FavoriteController
 *
 * REST controller for managing user's favorite movies/TV shows.
 * Provides CRUD operations for the favorites/watchlist feature.
 *
 * Base Path: /favorites
 *
 * Business Logic:
 * - Users can add movies to their favorites (watchlist)
 * - Users can remove movies from their favorites
 * - Users can view all their favorited movies
 * - Users can check if a specific movie is in their favorites
 *
 * Authentication:
 * - All endpoints require authentication via JWT token
 * - User information extracted from Authentication object
 *
 * Data Model:
 * - Each favorite links a User to a TMDB movie ID
 * - Stores timestamp of when favorite was added
 * - Prevents duplicate favorites per user
 *
 * @see FavoriteService for business logic
 * @see Favorite entity for data model
 */
@Slf4j
@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class FavoriteController {

    private final FavoriteService favoriteService;

    /**
     * Get all favorites for the authenticated user
     * GET /favorites
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Favorite>>> getUserFavorites(
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            log.debug("Fetching favorites for user: {}", user.getEmail());
            List<Favorite> favorites = favoriteService.getUserFavorites(user.getId());
            log.info("Successfully retrieved {} favorites for user: {}", favorites.size(), user.getEmail());
            return ResponseEntity.ok(ApiResponse.success(favorites));
        } catch (Exception e) {
            log.error("Error getting favorites for user: {}",
                    authentication != null ? ((User) authentication.getPrincipal()).getEmail() : "unknown", e);
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch favorites: " + e.getMessage()));
        }
    }

    /**
     * Add a movie to favorites
     * POST /favorites
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Favorite>> addFavorite(
            @Valid @RequestBody FavoriteRequest request,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            log.debug("Adding movie {} to favorites for user: {}", request.getMovieId(), user.getEmail());
            Favorite favorite = favoriteService.addFavorite(user, request.getMovieId());

            // Create a response with the favorite, ensuring serialization works
            try {
                log.info("Successfully added movie {} to favorites for user: {}", request.getMovieId(), user.getEmail());
                return ResponseEntity.ok(
                        ApiResponse.success("Added to favorites", favorite)
                );
            } catch (Exception e) {
                // If serialization fails, return a simpler response
                log.warn("Error serializing favorite for user: {}, falling back to simple response", user.getEmail(), e);
                // Return just the movieId and id to avoid serialization issues
                Favorite simpleFavorite = new Favorite();
                simpleFavorite.setId(favorite.getId());
                simpleFavorite.setMovieId(favorite.getMovieId());
                simpleFavorite.setAddedAt(favorite.getAddedAt());
                return ResponseEntity.ok(
                        ApiResponse.success("Added to favorites", simpleFavorite)
                );
            }
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request to add favorite: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error in addFavorite for movieId: {}", request.getMovieId(), e);
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to add favorite: " + e.getMessage()));
        }
    }

    /**
     * Remove a movie from favorites
     * DELETE /favorites/{movieId}
     */
    @DeleteMapping("/{movieId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable Integer movieId,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            favoriteService.removeFavorite(user.getId(), movieId);
            return ResponseEntity.ok(
                    ApiResponse.success("Removed from favorites", null)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Check if a movie is in user's favorites
     * GET /favorites/check/{movieId}
     */
    @GetMapping("/check/{movieId}")
    public ResponseEntity<ApiResponse<Boolean>> checkFavorite(
            @PathVariable Integer movieId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        boolean isFavorite = favoriteService.isFavorite(user.getId(), movieId);
        return ResponseEntity.ok(ApiResponse.success(isFavorite));
    }

}
