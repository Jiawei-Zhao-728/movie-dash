# MovieDash API Testing Procedure
## Complete Step-by-Step Guide

**Date:** October 29, 2025
**Backend:** Spring Boot 3.2.0 on port 8080
**Database:** H2 (in-memory)
**Auth:** JWT (Bearer Token)

---

## Table of Contents
1. [Prerequisites & Setup](#prerequisites--setup)
2. [Starting the Backend](#starting-the-backend)
3. [Testing Tools Setup](#testing-tools-setup)
4. [Test Flow Overview](#test-flow-overview)
5. [Authentication Endpoints](#authentication-endpoints)
6. [Favorites Endpoints](#favorites-endpoints)
7. [Reviews Endpoints](#reviews-endpoints)
8. [Error Scenarios](#error-scenarios)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites & Setup

### Required Software
- ✅ Java 17+
- ✅ Maven 3.6+
- ✅ curl (command line) OR Postman (GUI)
- ✅ jq (optional, for JSON formatting)

### Port Requirements
- Port 8080 must be available for backend
- Port 3000 for frontend (if testing integrated)

### Check Java & Maven
```bash
java -version   # Should show Java 17+
mvn -version    # Should show Maven 3.6+
```

---

## Starting the Backend

### Step 1: Navigate to Backend Directory
```bash
cd /home/user/movie-dash/backend
```

### Step 2: Clean & Compile (First Time)
```bash
mvn clean compile
```

**Expected:** BUILD SUCCESS

### Step 3: Start Spring Boot Server
```bash
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

Started MovieDashApplication in X.XXX seconds
```

### Step 4: Verify Server is Running
Open another terminal:
```bash
curl http://localhost:8080/actuator/health
```

**Expected Response:**
```json
{
  "status": "UP"
}
```

✅ **Backend is ready for testing!**

---

## Testing Tools Setup

### Option A: Using curl (Command Line)

**Advantages:** Simple, built-in, scriptable
**Best for:** Quick tests, CI/CD

### Option B: Using Postman (GUI)

**Advantages:** Visual, saves history, collections
**Best for:** Extensive testing, documentation

**Download:** https://www.postman.com/downloads/

---

## Test Flow Overview

```
1. Register User → Get JWT Token
2. Login → Verify JWT Token
3. Get Current User (with JWT)
4. Add Favorite (with JWT)
5. Get Favorites (with JWT)
6. Check Favorite Status (with JWT)
7. Remove Favorite (with JWT)
8. Create Review (with JWT)
9. Get Movie Reviews (public, no JWT)
10. Get User Reviews (with JWT)
11. Delete Review (with JWT)
12. Logout
```

---

## Authentication Endpoints

### 🔹 Test 1: Register New User

**Endpoint:** `POST /auth/register`
**Authentication:** None (public)

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
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjk4...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

**✅ Save the token!** You'll need it for authenticated requests.

**Store token in variable (bash):**
```bash
TOKEN="eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjk4..."
```

---

### 🔹 Test 2: Login with Email/Password

**Endpoint:** `POST /auth/login`
**Authentication:** None (public)

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
    "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNjk4...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

---

### 🔹 Test 3: Get Current User

**Endpoint:** `GET /auth/me`
**Authentication:** Required (JWT)

**Request:**
```bash
curl http://localhost:8080/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200 OK):**
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

---

### 🔹 Test 4: Logout

**Endpoint:** `POST /auth/logout`
**Authentication:** Required (JWT)

**Request:**
```bash
curl -X POST http://localhost:8080/auth/logout \
  -H "Authorization: Bearer $TOKEN"
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

## Favorites Endpoints

### 🔹 Test 5: Add Movie to Favorites

**Endpoint:** `POST /favorites`
**Authentication:** Required (JWT)

**Request:**
```bash
curl -X POST http://localhost:8080/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 550
  }'
```

**Expected Response (201 Created):**
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

---

### 🔹 Test 6: Get All Favorites

**Endpoint:** `GET /favorites`
**Authentication:** Required (JWT)

**Request:**
```bash
curl http://localhost:8080/favorites \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Favorites retrieved successfully",
  "data": [
    {
      "id": 1,
      "movieId": 550,
      "addedAt": "2025-10-29T15:30:00"
    }
  ]
}
```

---

### 🔹 Test 7: Check if Movie is Favorite

**Endpoint:** `GET /favorites/check/{movieId}`
**Authentication:** Required (JWT)

**Request:**
```bash
curl http://localhost:8080/favorites/check/550 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Favorite status checked",
  "data": true
}
```

---

### 🔹 Test 8: Remove Movie from Favorites

**Endpoint:** `DELETE /favorites/{movieId}`
**Authentication:** Required (JWT)

**Request:**
```bash
curl -X DELETE http://localhost:8080/favorites/550 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Removed from favorites",
  "data": null
}
```

---

## Reviews Endpoints

### 🔹 Test 9: Create Review for Movie

**Endpoint:** `POST /reviews`
**Authentication:** Required (JWT)

**Request:**
```bash
curl -X POST http://localhost:8080/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": 550,
    "rating": 5,
    "comment": "Absolutely amazing! Best movie ever!"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "movieId": 550,
    "rating": 5,
    "comment": "Absolutely amazing! Best movie ever!",
    "createdAt": "2025-10-29T15:35:00"
  }
}
```

---

### 🔹 Test 10: Get Reviews for Movie (Public)

**Endpoint:** `GET /reviews/movie/{movieId}`
**Authentication:** None (public)

**Request:**
```bash
curl http://localhost:8080/reviews/movie/550
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Reviews retrieved successfully",
  "data": [
    {
      "id": 1,
      "movieId": 550,
      "username": "testuser",
      "rating": 5,
      "comment": "Absolutely amazing! Best movie ever!",
      "createdAt": "2025-10-29T15:35:00"
    }
  ]
}
```

---

### 🔹 Test 11: Get Current User's Reviews

**Endpoint:** `GET /reviews/user`
**Authentication:** Required (JWT)

**Request:**
```bash
curl http://localhost:8080/reviews/user \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User reviews retrieved successfully",
  "data": [
    {
      "id": 1,
      "movieId": 550,
      "rating": 5,
      "comment": "Absolutely amazing! Best movie ever!",
      "createdAt": "2025-10-29T15:35:00"
    }
  ]
}
```

---

### 🔹 Test 12: Delete Review

**Endpoint:** `DELETE /reviews/{reviewId}`
**Authentication:** Required (JWT, must own review)

**Request:**
```bash
curl -X DELETE http://localhost:8080/reviews/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Review deleted successfully",
  "data": null
}
```

---

## Error Scenarios

### ❌ Test 13: Register with Duplicate Email

**Request:**
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "anotheruser",
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

### ❌ Test 14: Login with Wrong Password

**Request:**
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

---

### ❌ Test 15: Access Protected Endpoint Without Token

**Request:**
```bash
curl http://localhost:8080/favorites
```

**Expected Response (403 Forbidden):**
```json
{
  "timestamp": "2025-10-29T15:40:00",
  "status": 403,
  "error": "Forbidden",
  "path": "/favorites"
}
```

---

### ❌ Test 16: Add Duplicate Favorite

**Request:**
```bash
# Add same movie twice
curl -X POST http://localhost:8080/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"movieId": 550}'
```

**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Movie already in favorites",
  "data": null
}
```

---

### ❌ Test 17: Delete Review Not Owned by User

**Request:**
```bash
# Try to delete another user's review
curl -X DELETE http://localhost:8080/reviews/999 \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response (403 Forbidden):**
```json
{
  "success": false,
  "message": "Not authorized to delete this review",
  "data": null
}
```

---

## Complete Testing Script

Save this as `test_api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8080"

echo "🧪 MovieDash API Testing Script"
echo "================================"
echo ""

# Test 1: Register
echo "📝 Test 1: Register new user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}')

echo "Response: $REGISTER_RESPONSE"

# Extract token (requires jq)
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.data.token')
echo "✅ Token obtained: ${TOKEN:0:20}..."
echo ""

# Test 2: Login
echo "🔐 Test 2: Login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Test 3: Get current user
echo "👤 Test 3: Get current user..."
ME_RESPONSE=$(curl -s $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $ME_RESPONSE"
echo ""

# Test 4: Add favorite
echo "⭐ Test 4: Add favorite..."
FAV_RESPONSE=$(curl -s -X POST $BASE_URL/favorites \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"movieId":550}')

echo "Response: $FAV_RESPONSE"
echo ""

# Test 5: Get favorites
echo "📋 Test 5: Get all favorites..."
GET_FAV_RESPONSE=$(curl -s $BASE_URL/favorites \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $GET_FAV_RESPONSE"
echo ""

# Test 6: Create review
echo "✍️  Test 6: Create review..."
REVIEW_RESPONSE=$(curl -s -X POST $BASE_URL/reviews \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"movieId":550,"rating":5,"comment":"Amazing movie!"}')

echo "Response: $REVIEW_RESPONSE"
echo ""

# Test 7: Get movie reviews (public)
echo "📖 Test 7: Get movie reviews (public)..."
GET_REVIEWS_RESPONSE=$(curl -s $BASE_URL/reviews/movie/550)

echo "Response: $GET_REVIEWS_RESPONSE"
echo ""

echo "✅ All tests completed!"
```

**Run the script:**
```bash
chmod +x test_api.sh
./test_api.sh
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

### Network/Maven issues
```bash
# Check internet connection
ping repo.maven.apache.org

# Clear Maven cache
rm -rf ~/.m2/repository

# Try offline mode (if dependencies cached)
mvn -o spring-boot:run
```

### JWT Token expired
```bash
# Tokens expire after 24 hours by default
# Just login again to get a new token
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Database reset (H2 in-memory)
```bash
# Just restart the server - H2 resets automatically
# Stop: Ctrl+C
# Start: mvn spring-boot:run
```

---

## Summary Checklist

**Before Testing:**
- [ ] Backend server running on port 8080
- [ ] Health check passes: `curl http://localhost:8080/actuator/health`
- [ ] Testing tool ready (curl or Postman)

**Authentication Flow:**
- [ ] Register new user
- [ ] Login and get JWT token
- [ ] Get current user info
- [ ] Logout

**Favorites Flow:**
- [ ] Add movie to favorites
- [ ] Get all favorites
- [ ] Check favorite status
- [ ] Remove favorite

**Reviews Flow:**
- [ ] Create review
- [ ] Get movie reviews (public)
- [ ] Get user reviews
- [ ] Delete review

**Error Handling:**
- [ ] Duplicate email registration
- [ ] Invalid login credentials
- [ ] Unauthorized access (no token)
- [ ] Duplicate favorite
- [ ] Unauthorized deletion

---

**✅ All endpoints tested successfully = Backend is production-ready!**

---

*For frontend integration testing, see BACKEND_CODE_REVIEW.md*
