package com.moviedash.controller;

import com.moviedash.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class FavoriteController {

    private final FavoriteService favoriteService;

    // TODO: Implement favorite endpoints
    // GET /favorites
    // POST /favorites
    // DELETE /favorites/{movieId}

}
