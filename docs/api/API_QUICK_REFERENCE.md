# MovieDash API - Quick Reference Card

## Base URL
- **Development:** `http://localhost:8080`
- **Production:** Set via `REACT_APP_API_URL` environment variable

## Authentication
- **Type:** JWT Bearer Token
- **Header:** `Authorization: Bearer <token>`
- **Expiration:** 24 hours
- **Storage:** localStorage (frontend)

---

## All Endpoints at a Glance

### Authentication (`/auth`)
```
POST   /auth/register         │ Create account
POST   /auth/login            │ Login
GET    /auth/me               │ Current user (requires auth)
POST   /auth/logout           │ Logout (requires auth)
GET    /auth/test             │ Health check
```

### Favorites (`/favorites`)
```
GET    /favorites             │ Get all favorites (requires auth)
POST   /favorites             │ Add favorite (requires auth)
GET    /favorites/check/{id}  │ Check if favorited (requires auth)
DELETE /favorites/{id}        │ Remove favorite (requires auth)
```

### Reviews (`/reviews`)
```
GET    /reviews/movie/{id}    │ Get movie reviews (PUBLIC)
GET    /reviews/user          │ Get user's reviews (requires auth)
POST   /reviews               │ Create/update review (requires auth)
DELETE /reviews/{id}          │ Delete review (requires auth)
```

---

## Common Requests

### Register New User
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Favorites
```bash
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8080/favorites
```

### Add to Favorites
```bash
curl -X POST http://localhost:8080/favorites \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"movieId": 550}'
```

### Create Review
```bash
curl -X POST http://localhost:8080/reviews \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 550,
    "rating": 5,
    "comment": "Amazing movie!"
  }'
```

### Get Movie Reviews (Public)
```bash
curl http://localhost:8080/reviews/movie/550
```

---

## Response Format

### Success Response (200/201)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* endpoint-specific data */ }
}
```

### Error Response (400/403/500)
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```

---

## Field Validation Rules

| Field | Rules |
|-------|-------|
| **username** | 3-64 characters, unique |
| **email** | Valid email format, unique |
| **password** | 6-100 characters |
| **movieId** | Integer (from TMDb API) |
| **rating** | Integer 1-5 |
| **comment** | Optional string |

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input/validation error |
| 403 | Forbidden - Unauthorized or invalid token |
| 500 | Server Error - Unexpected error |

---

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Email already in use" | Email exists | Use different email |
| "Username already taken" | Username exists | Use different username |
| "Invalid email or password" | Login failed | Check credentials |
| "Movie already in favorites" | Duplicate favorite | Remove first, then add |
| "Favorite not found" | Invalid movieId | Check movieId |
| "Not authorized to delete this review" | Don't own review | Can only delete own reviews |
| 403 Forbidden | Missing/invalid JWT | Login again to get token |

---

## Frontend Integration

### JavaScript Example
```javascript
// Import the service
import { authService } from './services/authService';

// Register
const { token, user } = await authService.register(
  "username", 
  "email@example.com", 
  "password"
);

// Login
const { token, user } = await authService.login(
  "email@example.com", 
  "password"
);

// Get current user
const user = await authService.getCurrentUser();

// Favorites
const favorites = await authService.getFavorites();
await authService.addToFavorites(550);
await authService.removeFromFavorites(550);

// Reviews
const reviews = await authService.getUserReviews();
```

---

## Entity Models

### User
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2025-10-29T15:30:00"
}
```
Note: Password is never returned in API responses

### Favorite
```json
{
  "id": 1,
  "movieId": 550,
  "addedAt": "2025-10-29T15:30:00"
}
```

### Review
```json
{
  "id": 1,
  "movieId": 550,
  "rating": 5,
  "comment": "Amazing movie!",
  "createdAt": "2025-10-29T15:35:00"
}
```

---

## Security Notes

- Always use HTTPS in production
- Store JWT in secure HTTP-only cookies or localStorage
- Never expose JWT in URLs or logs
- Tokens expire after 24 hours (login again to renew)
- Passwords are hashed with BCrypt (not stored in plaintext)
- User passwords are never returned in API responses

---

## Configuration

### Backend (application.properties)
```properties
server.port=8080
jwt.secret=your-secret-key-here
jwt.expiration=86400000
spring.datasource.url=jdbc:h2:file:./data/moviedash
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080
```

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill the process if needed
kill -9 <PID>
```

### CORS error
- Verify frontend URL is in CORS whitelist
- Default allowed: http://localhost:3000, http://127.0.0.1:3000

### JWT token invalid
- Tokens expire after 24 hours
- Login again to get a new token
- Token must be in Bearer format

### Database reset
```bash
# H2 in-memory database resets when server restarts
# Just stop (Ctrl+C) and restart the backend
mvn spring-boot:run
```

---

## Useful Endpoints for Testing

| Endpoint | Purpose |
|----------|---------|
| `GET /auth/test` | Verify API is running |
| `GET /actuator/health` | Health check |
| `GET /h2-console` | H2 database admin (dev only) |

---

## Complete Documentation

For detailed information, see:
- **API_ENDPOINTS_MAP.md** - Complete endpoint reference
- **API_TESTING_PROCEDURE.md** - Full testing guide with examples
- **API_ANALYSIS_SUMMARY.txt** - Security analysis and issues
- **BACKEND_CODE_REVIEW.md** - Code review findings

---

**Last Updated:** October 29, 2025
**API Version:** 1.0
**Framework:** Spring Boot 3.2.0
