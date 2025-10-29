# MovieDash Backend (Spring Boot)

## Project Information

- **Group ID**: com.moviedash
- **Artifact ID**: movie-dash-backend
- **Version**: 1.0.0
- **Java Version**: 17
- **Spring Boot Version**: 3.2.0

## Project Structure

```
src/main/java/com/moviedash/
├── MovieDashApplication.java (main class)
├── config/
│   ├── SecurityConfig.java
│   └── WebConfig.java
├── controller/
│   ├── AuthController.java
│   ├── FavoriteController.java
│   └── ReviewController.java
├── service/
│   ├── UserService.java
│   ├── FavoriteService.java
│   └── ReviewService.java
├── repository/
│   ├── UserRepository.java
│   ├── FavoriteRepository.java
│   └── ReviewRepository.java
├── entity/
│   ├── User.java
│   ├── Favorite.java
│   └── Review.java
├── dto/
│   ├── request/
│   │   ├── FavoriteRequest.java
│   │   └── ReviewRequest.java
│   └── response/
│       └── ApiResponse.java
├── security/
│   ├── JwtUtil.java
│   └── JwtAuthenticationFilter.java
└── exception/
    └── GlobalExceptionHandler.java
```

## Dependencies

- Spring Boot Web
- Spring Boot Data JPA
- Spring Boot Security
- OAuth2 Client
- MySQL Driver (with H2 for development)
- Lombok
- Validation
- JJWT (JWT tokens)
- Spring Boot DevTools
- Spring Boot Test

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL (optional, H2 is configured for development)

### Build the Project

```bash
mvn clean install
```

### Run the Application

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Run with Local Profile

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

## Configuration

- **application.properties**: Main configuration file
- **application-local.properties**: Local development configuration (uses H2 database)

## Database

### H2 Database (Development)

- URL: `jdbc:h2:file:./data/moviedash`
- Console: `http://localhost:8080/h2-console`
- Username: `sa`
- Password: (empty)

### MySQL (Production - commented out)

Uncomment the MySQL configuration in `application-local.properties` when ready to use MySQL.

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Favorites

- `GET /favorites` - Get user's favorites
- `POST /favorites` - Add to favorites
- `DELETE /favorites/{movieId}` - Remove from favorites

### Reviews

- `GET /reviews/movie/{movieId}` - Get reviews for a movie
- `POST /reviews` - Create a review
- `PUT /reviews/{id}` - Update a review
- `DELETE /reviews/{id}` - Delete a review

## Next Steps

1. Implement business logic in service classes
2. Complete security configuration
3. Implement JWT authentication
4. Add API documentation (Swagger/OpenAPI)
5. Write unit tests and integration tests

## Notes

- All classes are created with basic structure
- TODO comments indicate where implementation is needed
- CORS is configured for `http://localhost:3000` (React frontend)
