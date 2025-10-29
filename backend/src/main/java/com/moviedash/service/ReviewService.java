package com.moviedash.service;

import com.moviedash.entity.Review;
import com.moviedash.entity.User;
import com.moviedash.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    /**
     * Get all reviews for a specific movie
     *
     * @param movieId the TMDb movie ID
     * @return list of reviews
     */
    public List<Review> getMovieReviews(Integer movieId) {
        return reviewRepository.findByMovieId(movieId);
    }

    /**
     * Get all reviews by a specific user
     *
     * @param userId the user ID
     * @return list of reviews
     */
    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    /**
     * Create or update a review
     * If user has already reviewed this movie, update it; otherwise create new
     *
     * @param user the user
     * @param movieId the TMDb movie ID
     * @param rating the rating (1-5)
     * @param comment the review comment
     * @return the created or updated review
     */
    @Transactional
    public Review createOrUpdateReview(User user, Integer movieId, Integer rating, String comment) {
        // Find existing review or create new one
        Review review = reviewRepository
                .findByUserIdAndMovieId(user.getId(), movieId)
                .orElse(new Review());

        // Set/update fields
        review.setUser(user);
        review.setMovieId(movieId);
        review.setRating(rating);
        review.setComment(comment);

        return reviewRepository.save(review);
    }

    /**
     * Delete a review
     * Only the owner of the review can delete it
     *
     * @param userId the user ID requesting deletion
     * @param reviewId the review ID to delete
     * @throws IllegalArgumentException if review not found or user is not the owner
     */
    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        // Check if user is the owner
        if (!review.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Not authorized to delete this review");
        }

        reviewRepository.delete(review);
    }

}
