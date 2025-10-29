package com.moviedash.controller;

import com.moviedash.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class ReviewController {

    private final ReviewService reviewService;

    // TODO: Implement review endpoints
    // GET /reviews/movie/{movieId}
    // POST /reviews
    // PUT /reviews/{id}
    // DELETE /reviews/{id}

}
