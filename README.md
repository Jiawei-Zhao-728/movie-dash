# MovieDash

A web application that allows users to discover, browse, and review movies and TV shows, utilizing data from The Movie Database (TMDb) API.

## Backend Structure

```plaintext
backend/
├── app/
│   ├── models/     # Database models
│   ├── routes/     # API endpoints
│   └── utils/      # Helper functions
├── config.py       # Configuration
└── run.py         # Application entry
```

## Database Schema

### Users Table

```sql
users
├── id (PRIMARY KEY)
├── email (UNIQUE)
├── google_id (UNIQUE)
├── username
└── created_at
```

### Favorites Table

```sql
favorites
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY -> users.id)
├── movie_id
└── added_at
```

### Reviews Table

```sql
reviews
├── id (PRIMARY KEY)
├── user_id (FOREIGN KEY -> users.id)
├── movie_id
├── rating (1-5)
├── comment
└── created_at
```

## Core API Endpoints

### Auth

- `/auth/google/login` - Google login
- `/auth/logout` - Logout

### User Features

- `/api/favorites` - Manage favorite movies
- `/api/reviews` - Manage movie reviews

## Environment Variables

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
TMDB_API_KEY=your_tmdb_api_key
```

## Getting Started

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd movie-dash
```

### 2. Backend Setup

```sh
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Environment Variables

Create a `.env` file in the `backend/` directory (or set these in your environment):

```
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://127.0.0.1:5000/auth/google/callback
TMDB_API_KEY=your_tmdb_api_key
```

#### Database Migration

```sh
flask db upgrade
```

#### Running the Backend

```sh
flask run
```

By default, this runs on `http://127.0.0.1:5000`.

---

### 3. Frontend Setup

```sh
npm install
npm start
```

This runs the React app on `http://127.0.0.1:3000`.

---

### 4. Important: Hostname Consistency

**For authentication to work, both frontend and backend must use the same host (either `127.0.0.1` or `localhost`).**

- If you use `127.0.0.1` for the backend, use `127.0.0.1` for the frontend (and in your browser address bar).
- If you use `localhost` for the backend, use `localhost` for the frontend.
- Do not mix `localhost` and `127.0.0.1`.

If you need to change the API URL in the frontend, edit `src/services/authService.js`:

```js
const API_URL = "http://127.0.0.1:5000";
```

---

### 5. Common Issues

- If you get logged out on refresh, make sure you are not mixing `localhost` and `127.0.0.1`.
- Clear cookies for both hosts if you switch.
- Make sure your `.env` and config variables are set correctly.

---

Now you and your teammates should be able to set up and run the project locally!
