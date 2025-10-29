package com.moviedash.controller;

import com.moviedash.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class AuthController {

    private final UserService userService;

    // TODO: Implement authentication endpoints
    // POST /auth/register
    // POST /auth/login
    // POST /auth/logout
    // GET /auth/me

}
