package com.moviedash.controller;

import com.moviedash.dto.request.ReviewRequest;
import com.moviedash.dto.response.ApiResponse;
import com.moviedash.dto.response.ReviewResponse;
import com.moviedash.entity.User;
import com.moviedash.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * Get all reviews for a specific movie (public endpoint)
     * GET /reviews/movie/{movieId}
     */
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMovieReviews(
            @PathVariable Integer movieId) {
        List<ReviewResponse> reviews = reviewService.getMovieReviews(movieId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    /**
     * Get all reviews by the authenticated user
     * GET /reviews/user
     */
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getUserReviews(
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<ReviewResponse> reviews = reviewService.getUserReviews(user.getId());
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    /**
     * Create or update a review
     * POST /reviews
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createOrUpdateReview(
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        ReviewResponse review = reviewService.createOrUpdateReview(
                user,
                request.getMovieId(),
                request.getRating(),
                request.getComment()
        );
        return ResponseEntity.ok(ApiResponse.success("Review saved successfully", review));
    }

    /**
     * Delete a review
     * DELETE /reviews/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            User user = (User) authentication.getPrincipal();
            reviewService.deleteReview(user.getId(), id);
            return ResponseEntity.ok(
                    ApiResponse.success("Review deleted successfully", null)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

}
