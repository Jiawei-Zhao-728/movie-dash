package com.moviedash.repository;

import com.moviedash.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUserId(Long userId);

    List<Review> findByMovieId(Integer movieId);

    Optional<Review> findByUserIdAndMovieId(Long userId, Integer movieId);

    boolean existsByUserIdAndMovieId(Long userId, Integer movieId);

}
