package com.moviedash.exception;

import com.moviedash.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * GlobalExceptionHandler
 *
 * Centralized exception handling for the entire application.
 * Catches exceptions thrown by controllers and returns standardized error responses.
 *
 * Exception Handling Strategy:
 * - Validation errors (400 Bad Request): Invalid request data
 * - Runtime exceptions (400 Bad Request): Business logic violations
 * - General exceptions (500 Internal Server Error): Unexpected errors
 *
 * Logging:
 * - All exceptions are logged with appropriate levels (WARN for client errors, ERROR for server errors)
 * - Full stack traces included for debugging
 * - Structured logging with SLF4J for better log management
 *
 * @see ApiResponse for response format
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle validation exceptions (e.g., @Valid annotation failures)
     * Returns 400 Bad Request with detailed validation error messages
     *
     * @param ex MethodArgumentNotValidException containing validation errors
     * @return ResponseEntity with error details
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        // Convert validation errors to a single message string for consistent ApiResponse format
        String errorMessage = errors.values().stream()
                .collect(Collectors.joining(", "));

        log.warn("Validation error: {} - Fields: {}", errorMessage, errors.keySet());
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(errorMessage));
    }

    /**
     * Handle runtime exceptions (business logic errors)
     * Returns 400 Bad Request for client-related errors
     *
     * @param ex RuntimeException thrown by business logic
     * @return ResponseEntity with error message
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException ex) {
        log.warn("Runtime exception: {} - {}", ex.getClass().getSimpleName(), ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /**
     * Handle all uncaught exceptions (fallback handler)
     * Returns 500 Internal Server Error
     *
     * @param ex Generic exception
     * @return ResponseEntity with error message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGlobalException(Exception ex) {
        // Log the full exception with stack trace for debugging
        log.error("Unexpected error occurred: {} - {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("An unexpected error occurred: " + ex.getMessage()));
    }

}
