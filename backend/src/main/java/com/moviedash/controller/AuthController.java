package com.moviedash.controller;

import com.moviedash.dto.response.ApiResponse;
import com.moviedash.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class AuthController {

    private final UserService userService;

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<Map<String, String>>> test() {
        Map<String, String> data = new HashMap<>();
        data.put("status", "running");
        data.put("message", "MovieDash API is working!");
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    // TODO: Implement authentication endpoints
    // POST /auth/register
    // POST /auth/login
    // POST /auth/logout
    // GET /auth/me

}
