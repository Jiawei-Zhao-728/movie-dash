package com.moviedash.service;

import com.moviedash.entity.Favorite;
import com.moviedash.entity.User;
import com.moviedash.repository.FavoriteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    /**
     * Get all favorites for a user
     *
     * @param userId the user ID
     * @return list of favorites
     */
    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    /**
     * Add a movie to user's favorites
     *
     * @param user the user
     * @param movieId the TMDb movie ID
     * @return the created favorite
     * @throws IllegalArgumentException if movie is already favorited
     */
    @Transactional
    public Favorite addFavorite(User user, Integer movieId) {
        // Check if already exists
        if (favoriteRepository.existsByUserIdAndMovieId(user.getId(), movieId)) {
            throw new IllegalArgumentException("Movie already in favorites");
        }

        // Create new favorite
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setMovieId(movieId);

        return favoriteRepository.save(favorite);
    }

    /**
     * Remove a movie from user's favorites
     *
     * @param userId the user ID
     * @param movieId the TMDb movie ID
     * @throws IllegalArgumentException if favorite doesn't exist
     */
    @Transactional
    public void removeFavorite(Long userId, Integer movieId) {
        if (!favoriteRepository.existsByUserIdAndMovieId(userId, movieId)) {
            throw new IllegalArgumentException("Favorite not found");
        }
        favoriteRepository.deleteByUserIdAndMovieId(userId, movieId);
    }

    /**
     * Check if a movie is in user's favorites
     *
     * @param userId the user ID
     * @param movieId the TMDb movie ID
     * @return true if favorited, false otherwise
     */
    public boolean isFavorite(Long userId, Integer movieId) {
        return favoriteRepository.existsByUserIdAndMovieId(userId, movieId);
    }

}
