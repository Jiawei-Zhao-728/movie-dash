package com.moviedash.controller;

import com.moviedash.dto.request.LoginRequest;
import com.moviedash.dto.request.RegisterRequest;
import com.moviedash.dto.response.ApiResponse;
import com.moviedash.entity.User;
import com.moviedash.security.JwtUtil;
import com.moviedash.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * AuthController
 *
 * REST controller for user authentication and authorization operations.
 * Handles user registration, login, logout, and authentication status checks.
 *
 * Base Path: /auth
 *
 * Authentication Flow:
 * 1. User registers or logs in with credentials
 * 2. Server validates credentials and generates JWT token
 * 3. Client stores token and includes it in subsequent requests
 * 4. JwtAuthenticationFilter validates token for protected endpoints
 *
 * Security Notes:
 * - Uses JWT (JSON Web Tokens) for stateless authentication
 * - Passwords are hashed using BCrypt before storage
 * - CORS enabled for localhost:3000 (React frontend)
 * - All endpoints return standardized ApiResponse wrapper
 *
 * @see UserService for business logic
 * @see JwtUtil for token generation and validation
 * @see ApiResponse for response format
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<Map<String, String>>> test() {
        Map<String, String> data = new HashMap<>();
        data.put("status", "running");
        data.put("message", "MovieDash API is working!");
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    /**
     * Register a new user
     * POST /auth/register
     * Body: { "username": "...", "email": "...", "password": "..." }
     * Returns: { "success": true, "data": { "token": "...", "user": {...} } }
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Register the user
            User user = userService.register(request.getUsername(), request.getEmail(), request.getPassword());

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail());

            // Prepare response data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("user", userData);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("User registered successfully", responseData));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    /**
     * Login with email and password
     * POST /auth/login
     * Body: { "email": "...", "password": "..." }
     * Returns: { "success": true, "data": { "token": "...", "user": {...} } }
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest request) {
        try {
            // Authenticate the user
            User user = userService.login(request.getEmail(), request.getPassword());

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail());

            // Prepare response data
            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("token", token);
            responseData.put("user", userData);

            return ResponseEntity.ok(ApiResponse.success("Login successful", responseData));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }

    /**
     * Get current authenticated user
     * GET /auth/me
     * Headers: Authorization: Bearer <token>
     * Returns: { "success": true, "data": { "id": ..., "username": "...", "email": "..." } }
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(@AuthenticationPrincipal User user) {
        try {
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("User not authenticated"));
            }

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("username", user.getUsername());
            userData.put("email", user.getEmail());

            return ResponseEntity.ok(ApiResponse.success(userData));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to get user: " + e.getMessage()));
        }
    }

    /**
     * Logout (client-side token removal)
     * POST /auth/logout
     * Returns: { "success": true, "message": "Logged out successfully" }
     * Note: JWT is stateless, so logout is handled client-side by removing the token
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        // Since JWT is stateless, logout is primarily handled on the client side
        // This endpoint exists for consistency and potential future server-side logout logic
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

}
