# Movie Dash

A web application for searching, browsing, and reviewing movies and TV shows using the TMDb API.

## Features (Planned)

- Movie and TV show search functionality
- Browse trending content
- User authentication with Firebase
- User reviews and ratings
- Favorite movies/shows list
- Responsive modern UI

## Tech Stack

- React.js
- Firebase Authentication
- TMDb API
- CSS for styling

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Jiawei-Zhao-728/movie-dash.git
```

2. Install dependencies:

```bash
cd movie-dash
npm install
```

3. Set up environment variables:

   - Create a `.env` file in the root directory
   - Add the following variables with your TMDb API credentials:

   ```
   REACT_APP_TMDB_API_KEY=your_api_key_here
   REACT_APP_TMDB_API_READ_ACCESS_TOKEN=your_access_token_here
   REACT_APP_TMDB_API_BASE_URL=https://api.themoviedb.org/3
   ```

   - You can get these credentials by:
     1. Creating an account at [TMDb](https://www.themoviedb.org/)
     2. Going to your account settings
     3. Requesting an API key
     4. Generating a read access token

4. Start the development server:

```bash
npm start
```
