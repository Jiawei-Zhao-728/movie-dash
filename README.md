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

[To be added: Installation and setup instructions]
