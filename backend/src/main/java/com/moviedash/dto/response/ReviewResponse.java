package com.moviedash.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Integer movieId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private String username; // Include username for display
    private Long userId; // Include userId to check ownership
}
