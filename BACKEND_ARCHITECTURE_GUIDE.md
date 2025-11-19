# MovieDash Backend Architecture Guide

## 🏗️ Overall Architecture: Layered Architecture Pattern

The backend follows a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React)                        │
│              http://localhost:3000                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP Requests (JSON)
                     │ Authorization: Bearer <JWT>
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SPRING SECURITY LAYER                      │
│  ┌──────────────────────────────────────────────────┐  │
│  │  JwtAuthenticationFilter                         │  │
│  │  - Extracts JWT from Authorization header        │  │
│  │  - Validates token                               │  │
│  │  - Sets user in SecurityContext                  │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  CONTROLLER LAYER                        │
│  - Receives HTTP requests                               │
│  - Validates input (DTOs)                              │
│  - Calls Service layer                                  │
│  - Returns ApiResponse<T>                              │
│                                                        │
│  Examples: AuthController, FavoriteController          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                          │
│  - Business logic                                       │
│  - Transaction management (@Transactional)              │
│  - Calls Repository layer                               │
│                                                        │
│  Examples: UserService, FavoriteService                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 REPOSITORY LAYER                      │
│  - Data access (Spring Data JPA)                      │
│  - Database queries                                    │
│  - Extends JpaRepository                               │
│                                                        │
│  Examples: UserRepository, FavoriteRepository         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                       │
│  - H2 (Development) or MySQL (Production)             │
│  - Stores entities (User, Favorite, Review)            │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Package Structure

```
com.moviedash/
├── MovieDashApplication.java          # Entry point
│
├── config/                            # Configuration classes
│   ├── SecurityConfig.java            # Security & CORS setup
│   └── WebConfig.java                 # Web configuration
│
├── controller/                        # REST Controllers (API endpoints)
│   ├── AuthController.java           # /auth/* endpoints
│   ├── FavoriteController.java       # /favorites/* endpoints
│   └── ReviewController.java         # /reviews/* endpoints
│
├── service/                           # Business logic layer
│   ├── UserService.java              # User operations
│   ├── FavoriteService.java          # Favorite operations
│   └── ReviewService.java            # Review operations
│
├── repository/                        # Data access layer
│   ├── UserRepository.java           # User database queries
│   ├── FavoriteRepository.java      # Favorite database queries
│   └── ReviewRepository.java         # Review database queries
│
├── entity/                            # Database entities (JPA)
│   ├── User.java                     # User table mapping
│   ├── Favorite.java                 # Favorite table mapping
│   └── Review.java                   # Review table mapping
│
├── dto/                               # Data Transfer Objects
│   ├── request/                       # Request DTOs
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   └── FavoriteRequest.java
│   └── response/                      # Response DTOs
│       └── ApiResponse.java           # Standard API response wrapper
│
├── security/                          # Security components
│   ├── JwtUtil.java                  # JWT token generation/validation
│   └── JwtAuthenticationFilter.java  # JWT filter for requests
│
└── exception/                          # Exception handling
    └── GlobalExceptionHandler.java    # Global exception handler
```

---

## 🔄 Request Flow Example: Adding a Favorite

Let's trace what happens when a user adds a movie to favorites:

### Step 1: Client Request

```javascript
// Frontend sends:
POST http://localhost:8080/favorites
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "Content-Type": "application/json"
}
Body: {
  "movieId": 550
}
```

### Step 2: Security Filter (JwtAuthenticationFilter)

```java
// JwtAuthenticationFilter.doFilterInternal()
1. Extracts JWT from "Authorization: Bearer <token>"
2. Validates token using JwtUtil.validateToken()
3. Extracts email from token: JwtUtil.getEmailFromToken()
4. Loads User from database: UserService.findByEmail()
5. Sets User in SecurityContext (makes it available to controllers)
```

### Step 3: Controller (FavoriteController)

```java
@PostMapping("/favorites")
public ResponseEntity<ApiResponse<Favorite>> addFavorite(
    @Valid @RequestBody FavoriteRequest request,  // Validates input
    Authentication authentication) {              // Gets user from SecurityContext

    User user = (User) authentication.getPrincipal();  // Extract authenticated user
    Favorite favorite = favoriteService.addFavorite(user, request.getMovieId());
    return ResponseEntity.ok(ApiResponse.success("Added to favorites", favorite));
}
```

### Step 4: Service (FavoriteService)

```java
@Transactional  // Ensures database transaction
public Favorite addFavorite(User user, Integer movieId) {
    // Business logic: Check if already exists
    if (favoriteRepository.existsByUserIdAndMovieId(user.getId(), movieId)) {
        throw new IllegalArgumentException("Movie already in favorites");
    }

    // Create new favorite
    Favorite favorite = new Favorite();
    favorite.setUser(user);
    favorite.setMovieId(movieId);

    // Save to database
    return favoriteRepository.save(favorite);
}
```

### Step 5: Repository (FavoriteRepository)

```java
// Spring Data JPA automatically implements:
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    // Custom query method
    boolean existsByUserIdAndMovieId(Long userId, Integer movieId);
}

// Spring generates SQL:
// SELECT COUNT(*) > 0 FROM favorites
// WHERE user_id = ? AND movie_id = ?
```

### Step 6: Database

```
INSERT INTO favorites (user_id, movie_id, added_at)
VALUES (4, 550, '2025-01-30 18:00:00')
```

### Step 7: Response Flow (Back up the layers)

```
Database → Repository → Service → Controller → Security → Client
```

---

## 🔐 Authentication Flow

### Registration Flow:

```
1. POST /auth/register
   Body: { username, email, password }

2. AuthController.register()
   ↓
3. UserService.register()
   - Checks if email/username exists
   - Hashes password with BCrypt
   - Saves User to database
   ↓
4. JwtUtil.generateToken(email)
   - Creates JWT with email as subject
   - Sets expiration (24 hours)
   - Signs with secret key
   ↓
5. Returns: { token, user }
```

### Login Flow:

```
1. POST /auth/login
   Body: { email, password }

2. AuthController.login()
   ↓
3. UserService.login()
   - Finds user by email
   - Compares password with BCrypt.matches()
   ↓
4. JwtUtil.generateToken(email)
   ↓
5. Returns: { token, user }
```

### Protected Endpoint Flow:

```
1. GET /favorites
   Headers: { Authorization: Bearer <token> }

2. JwtAuthenticationFilter intercepts
   - Extracts token
   - Validates token
   - Loads User
   - Sets in SecurityContext
   ↓
3. FavoriteController.getUserFavorites()
   - Gets User from Authentication object
   - Calls FavoriteService
   ↓
4. Returns user's favorites
```

---

## 🗄️ Database Relationships

### Entity Relationships:

```
User (1) ────────< (Many) Favorite
  │
  │
  └───────< (Many) Review
```

### User Entity:

```java
@Entity
public class User {
    @Id
    private Long id;
    private String username;
    private String email;
    private String password;  // Hashed with BCrypt

    @OneToMany(mappedBy = "user")
    private Set<Favorite> favorites;  // One user has many favorites

    @OneToMany(mappedBy = "user")
    private Set<Review> reviews;      // One user has many reviews
}
```

### Favorite Entity:

```java
@Entity
public class Favorite {
    @Id
    private Long id;

    @ManyToOne  // Many favorites belong to one user
    @JoinColumn(name = "user_id")
    private User user;

    private Integer movieId;  // TMDb movie ID (not a foreign key)
    private LocalDateTime addedAt;
}
```

---

## 🛡️ Security Configuration

### SecurityConfig.java Responsibilities:

1. **Password Encoding**: BCrypt password hasher
2. **CORS Configuration**: Allows requests from `localhost:3000`
3. **Session Management**: Stateless (no server-side sessions)
4. **Endpoint Protection**:
   - Public: `/auth/**`, `/`, `/h2-console/**`, `/reviews/movie/**`
   - Protected: Everything else requires JWT authentication
5. **JWT Filter**: Adds `JwtAuthenticationFilter` to filter chain

### Security Filter Chain Order:

```
1. CORS Filter
2. JwtAuthenticationFilter (custom)
3. UsernamePasswordAuthenticationFilter (default)
4. Authorization Filter
5. Controller
```

---

## 📝 DTOs (Data Transfer Objects)

### Why DTOs?

- **Separation**: Don't expose internal entities directly
- **Validation**: Use `@Valid` and Bean Validation
- **Flexibility**: Can change API without changing entities

### Request DTO Example:

```java
public class FavoriteRequest {
    @NotNull(message = "Movie ID is required")
    private Integer movieId;
}
```

### Response DTO Example:

```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;  // Generic type for any data

    // Static factory methods:
    ApiResponse.success(data)
    ApiResponse.error("Error message")
}
```

---

## ⚠️ Exception Handling

### GlobalExceptionHandler.java:

```java
@RestControllerAdvice  // Catches exceptions from all controllers
public class GlobalExceptionHandler {

    // Validation errors (400 Bad Request)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(...)

    // Business logic errors (400 Bad Request)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntime(...)

    // All other errors (500 Internal Server Error)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGlobal(...)
}
```

### Exception Flow:

```
Controller throws IllegalArgumentException
    ↓
Service throws IllegalArgumentException
    ↓
GlobalExceptionHandler catches it
    ↓
Returns: { success: false, message: "Error message" }
```

---

## 🔑 Key Annotations Explained

### @Entity

- Marks class as a JPA entity (maps to database table)

### @Repository

- Marks interface as a Spring Data repository
- Spring automatically implements it

### @Service

- Marks class as a service (business logic layer)
- Spring manages it as a bean

### @RestController

- Combines @Controller + @ResponseBody
- Methods return JSON automatically

### @Transactional

- Ensures all database operations in method succeed or all fail
- If exception occurs, database rolls back

### @Valid

- Triggers Bean Validation on request body
- Checks @NotNull, @Email, etc.

### @AuthenticationPrincipal

- Injects authenticated User from SecurityContext
- Alternative to: `(User) authentication.getPrincipal()`

---

## 🔄 Complete Example: User Registration

```
1. Client: POST /auth/register
   { "username": "john", "email": "john@example.com", "password": "secret123" }

2. SecurityConfig: Allows /auth/** without authentication ✅

3. AuthController.register():
   - @Valid validates RegisterRequest
   - Calls UserService.register()

4. UserService.register():
   - Checks if email/username exists (Repository)
   - Creates new User entity
   - Encodes password: passwordEncoder.encode("secret123")
   - Saves to database: userRepository.save(user)
   - Returns User entity

5. AuthController:
   - Generates JWT: jwtUtil.generateToken(user.getEmail())
   - Creates response: ApiResponse.success({ token, user })

6. Response:
   {
     "success": true,
     "message": "User registered successfully",
     "data": {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "user": { "id": 1, "username": "john", "email": "john@example.com" }
     }
   }
```

---

## 🎯 Key Concepts Summary

1. **Layered Architecture**: Controller → Service → Repository → Database
2. **Dependency Injection**: Spring automatically wires components together
3. **JWT Authentication**: Stateless, token-based authentication
4. **Spring Data JPA**: Automatic repository implementation
5. **Transaction Management**: @Transactional ensures data consistency
6. **Exception Handling**: Global handler catches all exceptions
7. **DTO Pattern**: Separates API contracts from database entities
8. **Security Filter Chain**: JWT filter runs before controllers

---

## 🚀 How to Add a New Feature

Example: Add "Watch Later" functionality

1. **Entity**: Create `WatchLater.java` entity
2. **Repository**: Create `WatchLaterRepository.java` interface
3. **Service**: Create `WatchLaterService.java` with business logic
4. **Controller**: Create `WatchLaterController.java` with endpoints
5. **DTO**: Create `WatchLaterRequest.java` for validation
6. **Update SecurityConfig**: Add endpoint permissions if needed

That's it! Spring Boot handles the rest automatically.

---

This architecture provides:

- ✅ **Separation of Concerns**: Each layer has one responsibility
- ✅ **Testability**: Easy to mock dependencies
- ✅ **Maintainability**: Changes in one layer don't affect others
- ✅ **Security**: Centralized authentication and authorization
- ✅ **Scalability**: Can easily add new features
