package com.moviedash.controller;

import com.moviedash.dto.request.FavoriteRequest;
import com.moviedash.dto.response.ApiResponse;
import com.moviedash.entity.Favorite;
import com.moviedash.entity.User;
import com.moviedash.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        User user = (User) authentication.getPrincipal();
        List<Favorite> favorites = favoriteService.getUserFavorites(user.getId());
        return ResponseEntity.ok(ApiResponse.success(favorites));
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
            Favorite favorite = favoriteService.addFavorite(user, request.getMovieId());
            return ResponseEntity.ok(
                    ApiResponse.success("Added to favorites", favorite)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
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
