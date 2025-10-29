# Backend Testing Guide
## MovieDash Spring Boot API Testing

**Date:** October 29, 2025
**Status:** Network issues preventing Maven compilation - Manual testing required when network is available

---

## ✅ Static Code Validation Results

### Code Quality Checks (Passed)
- ✅ **No TODO comments** - All implementation complete
- ✅ **No debug statements** - No System.out.println or printStackTrace
- ✅ **23 Java files** - All source files present
- ✅ **Configuration valid** - application.properties correctly configured
- ✅ **All commits pushed** - Working tree clean

### Files Implemented (23 total)
```
Entities (3):
  ✅ User.java
  ✅ Favorite.java
  ✅ Review.java

Repositories (3):
  ✅ UserRepository.java
  ✅ FavoriteRepository.java
  ✅ ReviewRepository.java

Services (3):
  ✅ UserService.java
  ✅ FavoriteService.java
  ✅ ReviewService.java

Controllers (3):
  ✅ AuthController.java
  ✅ FavoriteController.java
  ✅ ReviewController.java

Security (2):
  ✅ JwtUtil.java
  ✅ JwtAuthenticationFilter.java

DTOs (5):
  ✅ RegisterRequest.java
  ✅ LoginRequest.java
  ✅ FavoriteRequest.java
  ✅ ReviewRequest.java
  ✅ ApiResponse.java

Config (2):
  ✅ SecurityConfig.java
  ✅ WebConfig.java

Exception (1):
  ✅ GlobalExceptionHandler.java

Main (1):
  ✅ MovieDashApplication.java
```

---

## 🧪 Manual Testing Instructions

### Prerequisites
1. Java 17+ installed
2. Maven 3.6+ installed
3. Network connectivity to Maven Central
4. Ports 8080 (API) and 3000 (frontend) available

---

## Step 1: Compile & Run Backend

```bash
# Navigate to backend directory
cd /home/user/movie-dash/backend

# Clean and compile
mvn clean compile

# Run the application
mvn spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

MovieDash Backend started on port 8080
```

**Troubleshooting:**
- If port 8080 in use: Change `server.port=8081` in application.properties
- If database error: Delete `./data` folder and restart
- If security error: Check JWT secret is set in application.properties

---

## Step 2: Health Check

### Test: Basic Health Check
```bash
curl http://localhost:8080/auth/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "status": "running",
    "message": "MovieDash API is working!"
  }
}
```

---

## Step 3: Authentication Flow Testing

### Test 1: User Registration

**Request:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

**Save the token** for subsequent requests!

---

### Test 2: User Login

**Request:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

---

### Test 3: Get Current User

**Request:**
```bash
# Replace YOUR_TOKEN with actual token from login
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**Expected Error (401 Unauthorized) - No token:**
```json
{
  "success": false,
  "message": "Not authenticated",
  "data": null
}
```

---

### Test 4: Logout

**Request:**
```bash
curl -X POST http://localhost:8080/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

## Step 4: Favorites Testing

### Test 5: Add Movie to Favorites

**Request:**
```bash
curl -X POST http://localhost:8080/favorites \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"movieId": 550}'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Added to favorites",
  "data": {
    "id": 1,
    "user": { ... },
    "movieId": 550,
    "addedAt": "2025-10-29T16:30:00"
  }
}
```

**Expected Error - Duplicate:**
```json
{
  "success": false,
  "message": "Movie already in favorites",
  "data": null
}
```

---

### Test 6: Get User's Favorites

**Request:**
```bash
curl http://localhost:8080/favorites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "movieId": 550,
      "addedAt": "2025-10-29T16:30:00"
    }
  ]
}
```

---

### Test 7: Check if Movie is Favorited

**Request:**
```bash
curl http://localhost:8080/favorites/check/550 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": true
}
```

---

### Test 8: Remove from Favorites

**Request:**
```bash
curl -X DELETE http://localhost:8080/favorites/550 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Removed from favorites",
  "data": null
}
```

**Expected Error - Not Found:**
```json
{
  "success": false,
  "message": "Favorite not found",
  "data": null
}
```

---

## Step 5: Reviews Testing

### Test 9: Create a Review

**Request:**
```bash
curl -X POST http://localhost:8080/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 550,
    "rating": 5,
    "comment": "Absolutely amazing movie! A must watch."
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Review saved successfully",
  "data": {
    "id": 1,
    "movieId": 550,
    "rating": 5,
    "comment": "Absolutely amazing movie! A must watch.",
    "createdAt": "2025-10-29T16:35:00"
  }
}
```

**Expected Error - Invalid Rating:**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null
}
```

---

### Test 10: Get Reviews for a Movie (Public)

**Request:**
```bash
# No authentication required
curl http://localhost:8080/reviews/movie/550
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "movieId": 550,
      "rating": 5,
      "comment": "Absolutely amazing movie! A must watch.",
      "createdAt": "2025-10-29T16:35:00"
    }
  ]
}
```

---

### Test 11: Get User's Reviews

**Request:**
```bash
curl http://localhost:8080/reviews/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": 1,
      "movieId": 550,
      "rating": 5,
      "comment": "Absolutely amazing movie! A must watch.",
      "createdAt": "2025-10-29T16:35:00"
    }
  ]
}
```

---

### Test 12: Update a Review

**Request:**
```bash
# Same endpoint - will update if review exists
curl -X POST http://localhost:8080/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 550,
    "rating": 4,
    "comment": "Still great, but not perfect."
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Review saved successfully",
  "data": {
    "id": 1,
    "movieId": 550,
    "rating": 4,
    "comment": "Still great, but not perfect.",
    "createdAt": "2025-10-29T16:35:00"
  }
}
```

---

### Test 13: Delete a Review

**Request:**
```bash
curl -X DELETE http://localhost:8080/reviews/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

**Expected Error - Not Owner:**
```json
{
  "success": false,
  "message": "Not authorized to delete this review",
  "data": null
}
```

---

## Step 6: Database Verification

### Access H2 Console
1. Go to: http://localhost:8080/h2-console
2. JDBC URL: `jdbc:h2:file:./data/moviedash`
3. Username: `sa`
4. Password: (leave empty)
5. Click "Connect"

### Verify Tables Created

**Query:**
```sql
SELECT * FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'PUBLIC';
```

**Expected Tables:**
- `USERS` - User accounts
- `FAVORITES` - User favorites
- `REVIEWS` - User reviews

### Check User Data

**Query:**
```sql
SELECT id, username, email, created_at FROM users;
```

**Expected Result:**
```
ID  USERNAME   EMAIL              CREATED_AT
1   testuser   test@example.com   2025-10-29 16:30:00
```

### Check Favorites Data

**Query:**
```sql
SELECT id, user_id, movie_id, added_at FROM favorites;
```

### Check Reviews Data

**Query:**
```sql
SELECT id, user_id, movie_id, rating, comment, created_at FROM reviews;
```

---

## Step 7: Security Testing

### Test 14: Protected Endpoint Without Token

**Request:**
```bash
curl http://localhost:8080/favorites
```

**Expected Response (403 Forbidden):**
Spring Security will reject the request automatically.

---

### Test 15: Invalid Token

**Request:**
```bash
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer INVALID_TOKEN"
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Not authenticated",
  "data": null
}
```

---

### Test 16: Expired Token

Wait 24 hours (or change `jwt.expiration` to 60000 for 1 minute), then try:

**Request:**
```bash
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```

**Expected Response (401 Unauthorized)**

---

## Step 8: Validation Testing

### Test 17: Registration with Invalid Email

**Request:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user2",
    "email": "invalid-email",
    "password": "password123"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null
}
```

---

### Test 18: Review with Invalid Rating

**Request:**
```bash
curl -X POST http://localhost:8080/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 550,
    "rating": 10,
    "comment": "Too high rating"
  }'
```

**Expected Response (400 Bad Request):**
Validation error for rating (must be 1-5).

---

### Test 19: Short Password

**Request:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user3",
    "email": "user3@example.com",
    "password": "123"
  }'
```

**Expected Response (400 Bad Request):**
Password must be between 6 and 100 characters.

---

## Step 9: Edge Cases

### Test 20: Duplicate Email Registration

**Request:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "differentuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Email already in use",
  "data": null
}
```

---

### Test 21: Duplicate Username Registration

**Request:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "different@example.com",
    "password": "password123"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Username already taken",
  "data": null
}
```

---

### Test 22: Wrong Password Login

**Request:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

---

## Step 10: Performance Testing (Optional)

### Test 23: Concurrent Requests

Use Apache Bench (ab) or similar tool:

```bash
# Install ab if needed
sudo apt-get install apache2-utils

# Test 100 concurrent requests
ab -n 1000 -c 100 -H "Authorization: Bearer YOUR_TOKEN" \
   http://localhost:8080/favorites
```

**Expected:** Should handle 100+ requests/second

---

## 🐛 Common Issues & Solutions

### Issue 1: Port 8080 Already in Use
**Solution:** Change port in `application.properties`:
```properties
server.port=8081
```

### Issue 2: Database Lock Error
**Solution:** Delete H2 database files:
```bash
rm -rf data/
```

### Issue 3: JWT Token Expired
**Solution:** Login again to get new token.

### Issue 4: CORS Errors
**Solution:** Check `cors.allowed-origins` in `application.properties` matches frontend URL.

### Issue 5: 403 Forbidden
**Solution:** Ensure JWT token is in Authorization header with "Bearer " prefix.

---

## ✅ Testing Checklist

Use this checklist when running manual tests:

- [ ] Backend compiles successfully
- [ ] Server starts on port 8080
- [ ] H2 console accessible
- [ ] Health check endpoint works
- [ ] User registration successful
- [ ] User login returns JWT token
- [ ] JWT token validates correctly
- [ ] Get current user works with token
- [ ] Add favorite succeeds
- [ ] Get favorites returns list
- [ ] Check favorite status works
- [ ] Remove favorite succeeds
- [ ] Create review succeeds
- [ ] Get movie reviews works (public)
- [ ] Get user reviews works
- [ ] Update review succeeds
- [ ] Delete review succeeds
- [ ] Protected endpoints reject no token
- [ ] Invalid token rejected
- [ ] Email validation works
- [ ] Password validation works
- [ ] Rating validation works
- [ ] Duplicate email rejected
- [ ] Duplicate username rejected
- [ ] Wrong password rejected
- [ ] Authorization checks work

---

## 📊 Test Results Summary

**When you complete testing, fill this out:**

| Category | Tests | Passed | Failed | Issues |
|----------|-------|--------|--------|--------|
| Compilation | 1 | ⬜ | ⬜ | |
| Authentication | 4 | ⬜ | ⬜ | |
| Favorites | 4 | ⬜ | ⬜ | |
| Reviews | 5 | ⬜ | ⬜ | |
| Security | 3 | ⬜ | ⬜ | |
| Validation | 3 | ⬜ | ⬜ | |
| Edge Cases | 3 | ⬜ | ⬜ | |
| **Total** | **23** | **⬜** | **⬜** | |

---

## 🚀 Next Steps After Testing

1. **If all tests pass:**
   - ✅ Proceed with frontend integration
   - ✅ Update frontend API_URL to port 8080
   - ✅ Test full stack integration

2. **If tests fail:**
   - 🔍 Review error logs
   - 🐛 Fix issues in backend code
   - 🔁 Re-test failed cases
   - 📝 Document issues found

3. **Production readiness:**
   - Change JWT secret
   - Configure MySQL instead of H2
   - Add proper logging
   - Add monitoring (Spring Actuator)
   - Write automated tests

---

**Testing Status:** ⏳ Pending network connectivity
**Last Updated:** October 29, 2025
**Created by:** Claude Code
