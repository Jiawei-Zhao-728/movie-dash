# MovieDash API - Complete Endpoint Map

**Generated:** October 29, 2025  
**Backend Framework:** Spring Boot 3.2.0  
**API Type:** RESTful JSON API  
**Authentication:** JWT Bearer Tokens  
**Database:** H2 (development) / MySQL (production)  
**Frontend:** React 18+ with axios/fetch  

---

## Table of Contents
1. [API Architecture Overview](#api-architecture-overview)
2. [Complete Endpoint List](#complete-endpoint-list)
3. [Authentication Endpoints](#authentication-endpoints)
4. [Favorites Endpoints](#favorites-endpoints)
5. [Reviews Endpoints](#reviews-endpoints)
6. [Security & Middleware](#security--middleware)
7. [Error Handling](#error-handling)
8. [Known Issues & TODOs](#known-issues--todos)
9. [Testing Documentation](#testing-documentation)

---

## API Architecture Overview

### API Type
**REST API** - Standard RESTful design with HTTP methods (GET, POST, PUT, DELETE)

### Response Format
All endpoints return a unified response format:

```json
{
  "success": boolean,
  "message": string,
  "data": object | null
}
```

### Base URL
- **Development:** `http://localhost:8080`
- **Production:** Configured via `REACT_APP_API_URL` environment variable

### Authentication
- **Method:** JWT (JSON Web Tokens)
- **Header Format:** `Authorization: Bearer <token>`
- **Token Location:** `localStorage.getItem("token")`
- **Expiration:** 24 hours (86400000 ms)
- **Algorithm:** HMAC SHA-256
- **Secret:** Configurable in `application.properties` (jwt.secret)

### CORS Configuration
**Allowed Origins:**
- http://localhost:3000
- http://127.0.0.1:3000

**Allowed Methods:**
- GET, POST, PUT, DELETE, OPTIONS, PATCH

**Allowed Headers:**
- All headers allowed (*)

---

## Complete Endpoint List

### Summary Table

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/auth/test` | No | Health check / Test endpoint |
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login with email & password |
| GET | `/auth/me` | Yes | Get current authenticated user |
| POST | `/auth/logout` | Yes | Logout user (clear token) |
| GET | `/favorites` | Yes | Get user's favorite movies |
| POST | `/favorites` | Yes | Add movie to favorites |
| GET | `/favorites/check/{movieId}` | Yes | Check if movie is in favorites |
| DELETE | `/favorites/{movieId}` | Yes | Remove movie from favorites |
| GET | `/reviews/movie/{movieId}` | No | Get all reviews for a movie (PUBLIC) |
| GET | `/reviews/user` | Yes | Get current user's reviews |
| POST | `/reviews` | Yes | Create or update review |
| DELETE | `/reviews/{id}` | Yes | Delete review (owner only) |

---

## Authentication Endpoints

### Base Path: `/auth`

#### 1. Test Endpoint (Health Check)
```
GET /auth/test
```
**Authentication:** None (Public)  
**Purpose:** Verify API is running  

**Response (200 OK):**
```json
{
  "success": true,
  "message": "MovieDash API is working!",
  "data": {
    "status": "running",
    "message": "MovieDash API is working!"
  }
}
```

**Frontend Usage:**
```javascript
// Test if backend is available
const response = await fetch("http://localhost:8080/auth/test");
```

---

#### 2. Register New User
```
POST /auth/register
```
**Authentication:** None (Public)  
**Purpose:** Create new user account  

**Request Body:**
```json
{
  "username": "string (3-64 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (6-100 chars, required)"
}
```

**Validation Rules:**
- Username: 3-64 characters
- Email: Valid email format
- Password: 6-100 characters

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email/email already exists
- `400 Bad Request` - Username already taken
- `400 Bad Request` - Invalid password (too short/long)

**Frontend Usage (from authService.js):**
```javascript
const response = await authService.register("username", "email@example.com", "password123");
// Returns: { token, user }
```

---

#### 3. Login
```
POST /auth/login
```
**Authentication:** None (Public)  
**Purpose:** Authenticate user and get JWT token  

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email or password

**Frontend Usage:**
```javascript
const { token, user } = await authService.login("test@example.com", "password123");
localStorage.setItem("token", token);
```

---

#### 4. Get Current User
```
GET /auth/me
```
**Authentication:** Required (JWT)  
**Purpose:** Get currently logged-in user info  

**Request:**
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8080/auth/me
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**Error Responses:**
- `403 Forbidden` - Invalid or missing JWT token

**Frontend Usage:**
```javascript
const user = await authService.getCurrentUser();
```

---

#### 5. Logout
```
POST /auth/logout
```
**Authentication:** Required (JWT)  
**Purpose:** Logout user (frontend handles token removal)  

**Request:**
```bash
curl -X POST -H "Authorization: Bearer <token>" http://localhost:8080/auth/logout
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

**Frontend Usage:**
```javascript
await authService.logout();
localStorage.removeItem("token");
```

---

## Favorites Endpoints

### Base Path: `/favorites`

#### 1. Get User's Favorites
```
GET /favorites
```
**Authentication:** Required (JWT)  
**Purpose:** Retrieve all movies favorited by current user  

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "movieId": 550,
      "addedAt": "2025-10-29T15:30:00"
    },
    {
      "id": 2,
      "movieId": 278,
      "addedAt": "2025-10-29T16:00:00"
    }
  ]
}
```

**Error Responses:**
- `403 Forbidden` - Invalid or missing JWT token

**Frontend Usage:**
```javascript
const favorites = await authService.getFavorites();
```

---

#### 2. Add Movie to Favorites
```
POST /favorites
```
**Authentication:** Required (JWT)  
**Purpose:** Add a movie to user's favorites  

**Request Body:**
```json
{
  "movieId": 550
}
```

**Validation:**
- movieId: Must be integer, not null (from TMDb API)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Added to favorites",
  "data": {
    "id": 1,
    "movieId": 550,
    "addedAt": "2025-10-29T15:30:00"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Movie already in favorites
- `400 Bad Request` - Invalid movieId (missing or non-integer)
- `403 Forbidden` - Invalid or missing JWT token

**Frontend Usage:**
```javascript
const favorite = await authService.addToFavorites(550);
```

---

#### 3. Check if Movie is Favorite
```
GET /favorites/check/{movieId}
```
**Authentication:** Required (JWT)  
**Purpose:** Check if a specific movie is in user's favorites  

**Path Parameters:**
- `movieId` (integer) - TMDb movie ID

**Response (200 OK - is favorite):**
```json
{
  "success": true,
  "message": "Success",
  "data": true
}
```

**Response (200 OK - not favorite):**
```json
{
  "success": true,
  "message": "Success",
  "data": false
}
```

**Error Responses:**
- `403 Forbidden` - Invalid or missing JWT token

**Frontend Usage:**
```javascript
const isFavorite = await authService.checkFavorite(550);
```

---

#### 4. Remove Movie from Favorites
```
DELETE /favorites/{movieId}
```
**Authentication:** Required (JWT)  
**Purpose:** Remove a movie from user's favorites  

**Path Parameters:**
- `movieId` (integer) - TMDb movie ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Removed from favorites",
  "data": null
}
```

**Error Responses:**
- `400 Bad Request` - Favorite not found
- `403 Forbidden` - Invalid or missing JWT token

**Frontend Usage:**
```javascript
await authService.removeFromFavorites(550);
```

---

## Reviews Endpoints

### Base Path: `/reviews`

#### 1. Get Reviews for a Movie (PUBLIC)
```
GET /reviews/movie/{movieId}
```
**Authentication:** None (Public)  
**Purpose:** Get all reviews for a specific movie  

**Path Parameters:**
- `movieId` (integer) - TMDb movie ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "movieId": 550,
      "rating": 5,
      "comment": "Amazing movie!",
      "createdAt": "2025-10-29T15:35:00"
    },
    {
      "id": 2,
      "movieId": 550,
      "rating": 4,
      "comment": "Great film, highly recommend",
      "createdAt": "2025-10-29T16:00:00"
    }
  ]
}
```

**Note:** User information is NOT included (usernames/ids not exposed for privacy)

**Frontend Usage:**
```javascript
const reviews = await fetch("http://localhost:8080/reviews/movie/550").then(r => r.json());
```

---

#### 2. Get Current User's Reviews
```
GET /reviews/user
```
**Authentication:** Required (JWT)  
**Purpose:** Get all reviews written by the current user  

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "movieId": 550,
      "rating": 5,
      "comment": "Amazing movie!",
      "createdAt": "2025-10-29T15:35:00"
    },
    {
      "id": 3,
      "movieId": 278,
      "rating": 4,
      "comment": "Great classic",
      "createdAt": "2025-10-29T16:30:00"
    }
  ]
}
```

**Error Responses:**
- `403 Forbidden` - Invalid or missing JWT token

**Frontend Usage:**
```javascript
const userReviews = await authService.getUserReviews();
```

---

#### 3. Create or Update Review
```
POST /reviews
```
**Authentication:** Required (JWT)  
**Purpose:** Create a new review or update existing review for a movie  

**Request Body:**
```json
{
  "movieId": 550,
  "rating": 5,
  "comment": "Optional review comment"
}
```

**Validation Rules:**
- movieId: Required, integer (from TMDb)
- rating: Required, integer between 1-5
- comment: Optional, string

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Review saved successfully",
  "data": {
    "id": 1,
    "movieId": 550,
    "rating": 5,
    "comment": "Optional review comment",
    "createdAt": "2025-10-29T15:35:00"
  }
}
```

**Behavior:**
- If user hasn't reviewed this movie before: Creates new review
- If user has reviewed this movie: Updates existing review
- Can update rating and/or comment

**Error Responses:**
- `400 Bad Request` - Invalid rating (must be 1-5)
- `400 Bad Request` - Missing movieId or rating
- `403 Forbidden` - Invalid or missing JWT token

**Frontend Usage:**
```javascript
const review = await authService.createReview(550, 5, "Great movie!");
```

---

#### 4. Delete Review
```
DELETE /reviews/{id}
```
**Authentication:** Required (JWT)  
**Purpose:** Delete a review (must be owner of review)  

**Path Parameters:**
- `id` (long) - Review ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

**Error Responses:**
- `400 Bad Request` - Review not found
- `403 Forbidden` - Not authorized to delete this review (not the owner)
- `403 Forbidden` - Invalid or missing JWT token

**Authorization:**
- Users can only delete their own reviews
- Server validates ownership before deletion

**Frontend Usage:**
```javascript
await authService.deleteReview(1);
```

---

## Security & Middleware

### 1. JWT Authentication Filter
**Class:** `JwtAuthenticationFilter.java`

**Functionality:**
- Extracts JWT from Authorization header
- Validates token signature and expiration
- Sets user in SecurityContext if token is valid
- Runs on every request before reaching controllers
- Silently continues if no token (public endpoints don't require auth)

**Token Extraction Logic:**
```java
// Expects: "Bearer <token>"
String bearerToken = request.getHeader("Authorization");
if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
    String token = bearerToken.substring(7); // Extract token
}
```

### 2. Security Configuration
**Class:** `SecurityConfig.java`

**CORS Configuration:**
```
Allowed Origins: http://localhost:3000, http://127.0.0.1:3000
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
Allowed Headers: * (all)
Max Age: 3600 seconds
```

**Endpoint Authorization:**
```
PUBLIC (No Authentication Required):
- /auth/**                 (All auth endpoints)
- /reviews/movie/**        (Public movie reviews)
- /h2-console/**          (H2 database console - dev only)
- /actuator/health        (Health check)

PROTECTED (Authentication Required):
- /favorites/**           (All favorites operations)
- /reviews/user           (User's reviews)
- /reviews (POST)         (Create review)
- /reviews/{id} (DELETE)  (Delete review)
- /auth/me                (Get current user)
- /auth/logout            (Logout)
```

### 3. Password Security
**Algorithm:** BCryptPasswordEncoder
**Features:**
- Passwords hashed with BCrypt (not stored in plaintext)
- Password never exposed in API responses (@JsonIgnore)
- Salt automatically generated per password
- Cost factor: Default (10-12 rounds)

### 4. JWT Token Details
**File:** `JwtUtil.java`

**Token Structure:**
- Algorithm: HMAC SHA-256
- Subject (sub): User's email
- Issued At (iat): Token creation timestamp
- Expiration (exp): 24 hours from creation
- Signature: HMAC SHA-256

**Token Validation:**
- Checks signature validity
- Checks expiration time
- Returns false if invalid or expired

**Configuration (application.properties):**
```
jwt.secret=your-256-bit-secret-key-please-change-this-in-production-environment
jwt.expiration=86400000  # 24 hours in milliseconds
```

---

## Error Handling

### Global Exception Handler
**Class:** `GlobalExceptionHandler.java`

### Error Response Format

**Validation Errors (400):**
```json
{
  "fieldName1": "error message",
  "fieldName2": "error message"
}
```

**Business Logic Errors (400):**
```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "data": null
}
```

**Server Errors (500):**
```json
{
  "success": false,
  "message": "An unexpected error occurred: exception details",
  "data": null
}
```

### Common Error Scenarios

| Scenario | Status | Response |
|----------|--------|----------|
| Email already exists | 400 | `"Email already in use"` |
| Username already taken | 400 | `"Username already taken"` |
| Invalid email/password | 400 | `"Invalid email or password"` |
| Movie already favorited | 400 | `"Movie already in favorites"` |
| Favorite not found | 400 | `"Favorite not found"` |
| Review not found | 400 | `"Review not found"` |
| Unauthorized deletion | 403 | `"Not authorized to delete this review"` |
| No JWT token | 403 | Standard Spring Security error |
| Invalid JWT token | 403 | Silent - filter just doesn't set auth |
| Missing required field | 400 | Field-level validation error |
| Rating out of range | 400 | `"Rating must be between 1 and 5"` |

---

## Known Issues & TODOs

### ISSUE 1: Incomplete Authentication Endpoints
**Severity:** Medium  
**Status:** Needs Implementation  
**Location:** `AuthController.java` (lines 28-32)  

**Current State:**
```java
// TODO: Implement authentication endpoints
// POST /auth/register
// POST /auth/login
// POST /auth/logout
// GET /auth/me
```

**Issue:**
- These endpoints are marked as TODO but are actually implemented in the services
- The controller only has `/auth/test` endpoint exposed
- Frontend is calling these endpoints successfully (from authService.js)
- The actual implementations exist in `UserService.java`

**Expected:**
- Controller should have @PostMapping and @GetMapping annotations
- Should not have TODO comments if functionality exists

**Impact:**
- Code documentation is misleading
- TodoController doesn't match actual API capability
- Frontend works because backends services ARE implemented

**Action Required:**
- Remove TODO comment from AuthController
- Add proper @RequestMapping annotations to match frontend calls
- OR verify the implementation is working and document it properly

---

### ISSUE 2: Confusing Frontend API Service
**Severity:** Low  
**Status:** Works, but unclear  
**Location:** `authService.js`  

**Problem:**
- Service calls endpoints (like `/auth/register`) that don't appear in AuthController
- Frontend has legacy watchlist methods alongside new favorites methods
- No clear indication of which API methods are actually implemented

**Confusing Code (lines 174-183):**
```javascript
// Kept legacy names for backward compatibility
getWatchlist: async () => {
  return authService.getFavorites();
},
addToWatchlist: async (movieId) => {
  return authService.addToFavorites(movieId);
},
removeFromWatchlist: async (movieId) => {
  return authService.removeFromFavorites(movieId);
},
```

**Issue:**
- No clear indication which methods are primary
- Legacy methods add unnecessary complexity
- Could confuse developers about deprecated APIs

---

### ISSUE 3: H2 Database in Production Config
**Severity:** Medium  
**Status:** Configuration Issue  
**Location:** `application.properties`  

**Problem:**
```properties
# Database Configuration - H2 (Embedded Database for Development)
spring.datasource.url=jdbc:h2:file:./data/moviedash
```

**Issues:**
- H2 is configured for production
- Data stored in relative path `./data/moviedash` (could be anywhere)
- H2 console enabled in production (`spring.h2.console.enabled=true`)
- No production database configuration active by default

**Risk:**
- Security risk: H2 console exposes database structure/data
- Data loss: File-based H2 can be deleted/corrupted
- Not suitable for multi-instance deployments

**Recommendation:**
- Use environment-specific profiles
- Disable H2 console in production
- Use MySQL/PostgreSQL for production

---

### ISSUE 4: JWT Secret Exposed in Code
**Severity:** High  
**Status:** Security Vulnerability  
**Location:** `application.properties` (line 30)  

**Problem:**
```properties
jwt.secret=your-256-bit-secret-key-please-change-this-in-production-environment
```

**Issues:**
- Secret is default/placeholder in code
- Could be leaked in git commits
- Not using environment variables
- Weak secret (not actually 256-bit)

**Risk:**
- Anyone with repository access can generate valid tokens
- Tokens could be forged
- No security if deployed

**Recommendation:**
- Use environment variable: `${JWT_SECRET:default}`
- Never commit secrets to git
- Generate strong 256-bit secret for production

---

### ISSUE 5: Missing Avatar/Username Fields in Review Display
**Severity:** Low  
**Status:** API Design Issue  
**Location:** Review endpoints  

**Problem:**
- `/reviews/movie/{movieId}` returns reviews WITHOUT username or user info
- Frontend might need to display "Who wrote this review?"
- Can't show user profile links

**Current Response:**
```json
{
  "id": 1,
  "movieId": 550,
  "rating": 5,
  "comment": "Amazing!",
  "createdAt": "2025-10-29T15:35:00"
  // Missing: username, user avatar, user ID
}
```

**API Design Options:**
1. Include username only (privacy)
2. Include user ID for profile links
3. Include user object (currently @JsonIgnore prevents this)

---

### ISSUE 6: No Password Strength Validation
**Severity:** Medium  
**Status:** Missing Feature  
**Location:** `RegisterRequest.java` and `UserService.java`  

**Current Validation:**
```java
@Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
```

**Missing Validation:**
- No uppercase letter requirement
- No digit requirement
- No special character requirement
- No common password blacklist
- No password history (can't reuse)

**Recommendation:**
- Add regex pattern for complexity
- Use dedicated password validator
- Consider NIST password guidelines (no complexity rules)

---

### ISSUE 7: No Rate Limiting
**Severity:** Medium  
**Status:** Missing Security Feature  
**Location:** None (not implemented)  

**Problem:**
- No rate limiting on authentication endpoints
- Could allow brute force attacks on `/auth/login`
- No CAPTCHA or progressive delay

**Recommendation:**
- Implement rate limiting middleware
- Limit login attempts (e.g., 5 per minute per IP)
- Add progressive delays on failed attempts

---

### ISSUE 8: No Email Verification
**Severity:** Medium  
**Status:** Missing Feature  
**Location:** `/auth/register`  

**Current Behavior:**
- User registered immediately
- No email confirmation required
- Anyone can register with any email (could spam others)

**Recommendation:**
- Send verification email on registration
- Mark user as unverified until email confirmed
- Skip email verification in dev environment

---

## Testing Documentation

### Files Available

1. **API_TESTING_PROCEDURE.md** (752 lines)
   - Complete step-by-step testing guide
   - curl and Postman examples
   - All 17 test scenarios covered
   - Troubleshooting guide
   - Automated test script included

2. **BACKEND_CODE_REVIEW.md** (200+ lines)
   - Code review findings
   - 2 critical bugs fixed (JSON serialization, public endpoint access)
   - Full API endpoint summary
   - Security analysis
   - Frontend integration checklist

3. **BACKEND_TESTING_GUIDE.md**
   - Unit test guidance
   - Integration test examples
   - Controller test patterns

4. **BACKEND_MIGRATION_GUIDE.md** (52KB)
   - Migration documentation
   - Database schema
   - Configuration management

### Test Scenarios Covered

**Authentication Flow:**
- Register new user ✅
- Login ✅
- Get current user ✅
- Logout ✅
- Invalid credentials ✅
- Duplicate email ✅

**Favorites Flow:**
- Add favorite ✅
- Get favorites ✅
- Check favorite status ✅
- Remove favorite ✅
- Duplicate favorite error ✅

**Reviews Flow:**
- Create review ✅
- Get movie reviews (public) ✅
- Get user reviews ✅
- Delete review ✅
- Unauthorized deletion ✅

### Test Execution
```bash
# Backend must be running on port 8080
mvn spring-boot:run

# In another terminal, run provided test script
chmod +x test_api.sh
./test_api.sh
```

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Total Endpoints | 13 |
| Public Endpoints | 4 |
| Protected Endpoints | 9 |
| Controllers | 3 |
| Services | 3 |
| Repositories | 3 |
| Entities | 3 |
| DTOs (Request) | 4 |
| DTOs (Response) | 1 |
| Java Source Files | 23 |
| Known Issues | 8 |
| Security Findings | 3 High, 3 Medium, 2 Low |

---

## Quick Reference

### Frontend API Service Endpoints
Location: `/src/services/authService.js`

```javascript
authService.login(email, password)           // POST /auth/login
authService.register(username, email, pass)  // POST /auth/register
authService.getCurrentUser()                 // GET /auth/me
authService.logout()                         // POST /auth/logout
authService.getFavorites()                   // GET /favorites
authService.addToFavorites(movieId)          // POST /favorites
authService.removeFromFavorites(movieId)     // DELETE /favorites/{id}
authService.checkFavorite(movieId)           // GET /favorites/check/{id}
```

### Environment Variables

**Backend (application.properties):**
- `jwt.secret` - JWT signing key
- `jwt.expiration` - Token expiration in milliseconds
- `spring.datasource.url` - Database URL
- `spring.datasource.username` - DB username
- `spring.datasource.password` - DB password

**Frontend (.env):**
- `REACT_APP_API_URL` - Backend API base URL (default: http://localhost:8080)

---

## Conclusion

The MovieDash API is a **well-structured REST API** with:
- ✅ Clean RESTful design
- ✅ Proper authentication with JWT
- ✅ Good error handling
- ✅ CORS properly configured
- ✅ Comprehensive service layer
- ⚠️ Some security issues that should be addressed
- ⚠️ Missing production-ready features (email verification, rate limiting)
- ⚠️ Confusing TODO comments vs. actual implementation

**Recommendation:** The API is ready for development and testing. For production, address the security issues noted above, especially JWT secret management and database configuration.

