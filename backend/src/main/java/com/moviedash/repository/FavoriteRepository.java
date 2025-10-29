package com.moviedash.repository;

import com.moviedash.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserId(Long userId);

    Optional<Favorite> findByUserIdAndMovieId(Long userId, Integer movieId);

    void deleteByUserIdAndMovieId(Long userId, Integer movieId);

    boolean existsByUserIdAndMovieId(Long userId, Integer movieId);

}
