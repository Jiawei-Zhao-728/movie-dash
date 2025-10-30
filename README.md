# MovieDash 🎬

A modern, full-stack web application for discovering, browsing, and managing your favorite movies and TV shows. Built with React and Spring Boot, powered by The Movie Database (TMDb) API.

![MovieDash](https://img.shields.io/badge/React-18.2.0-blue) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green) ![Java](https://img.shields.io/badge/Java-17-orange)

## ✨ Features

- 🎭 **Browse Movies & TV Shows** - Explore trending content with beautiful, responsive movie cards
- 🔍 **Advanced Search** - Search movies and TV shows with filters by genre, year, and type
- ⭐ **Favorites/Watchlist** - Save your favorite movies to a personalized watchlist
- 💬 **Reviews** - Write and read reviews for movies (coming soon)
- 👤 **User Profiles** - Manage your account with a personalized profile page
- 🔐 **Secure Authentication** - JWT-based authentication with user registration and login
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Spring Boot 3.2.0** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database abstraction
- **JWT** - Token-based authentication
- **H2 Database** - Development database
- **MySQL** - Production database (optional)
- **Lombok** - Boilerplate reduction

### External APIs
- **TMDb API** - Movie and TV show data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) and **npm**
- **Java 17** or higher
- **Maven 3.6+**
- **TMDb API Key** ([Get one here](https://www.themoviedb.org/settings/api))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd movie-dash
```

### 2. Backend Setup

#### Navigate to the backend directory

```bash
cd backend
```

#### Build the project

```bash
mvn clean install
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` directory or set the following environment variables:

**Required:**
```bash
# JWT Configuration
JWT_SECRET=your-256-bit-secret-key-please-change-this-in-production

# TMDb API (Optional - can be set in frontend)
TMDB_API_KEY=your_tmdb_api_key
```

The backend uses H2 database by default for development (no additional setup required). The database file will be created automatically in `backend/data/moviedash.mv.db`.

#### Run the Backend

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**H2 Database Console:** `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/moviedash`
- Username: `sa`
- Password: (leave empty)

### 3. Frontend Setup

#### Navigate to the frontend directory (root of project)

```bash
# From the root directory
npm install
```

#### Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# TMDb API Configuration
REACT_APP_TMDB_API_KEY=your_tmdb_api_key
REACT_APP_TMDB_API_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_API_READ_ACCESS_TOKEN=your_tmdb_read_access_token

# Backend API URL (default: http://localhost:8080)
REACT_APP_API_URL=http://localhost:8080
```

**Note:** You need both:
- **API Key** - Get from [TMDb Settings](https://www.themoviedb.org/settings/api)
- **Read Access Token** - Generate from [TMDb Developer](https://developer.themoviedb.org/docs/getting-started)

#### Run the Frontend

```bash
npm start
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
movie-dash/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/moviedash/
│   │   │   │   ├── config/        # Security & web configuration
│   │   │   │   ├── controller/    # REST controllers
│   │   │   │   ├── service/       # Business logic
│   │   │   │   ├── repository/    # Data access layer
│   │   │   │   ├── entity/        # Database entities
│   │   │   │   ├── dto/           # Data transfer objects
│   │   │   │   ├── security/      # JWT & authentication
│   │   │   │   └── exception/     # Error handling
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── data/               # H2 database files
│   └── pom.xml
│
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   ├── context/            # React Context providers
│   ├── services/           # API services
│   └── styles/             # CSS files
│
├── public/                 # Static files
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user information

### Favorites
- `GET /favorites` - Get user's favorite movies
- `POST /favorites` - Add movie to favorites
- `DELETE /favorites/{movieId}` - Remove movie from favorites
- `GET /favorites/check/{movieId}` - Check if movie is favorited

### Reviews
- `GET /reviews/movie/{movieId}` - Get reviews for a movie (public)
- `GET /reviews/user` - Get user's reviews
- `POST /reviews` - Create a review
- `PUT /reviews/{id}` - Update a review
- `DELETE /reviews/{id}` - Delete a review

## 🗄️ Database Schema

### Users
- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `created_at`

### Favorites
- `id` (Primary Key)
- `user_id` (Foreign Key → users.id)
- `movie_id` (TMDb movie ID)
- `added_at`

### Reviews
- `id` (Primary Key)
- `user_id` (Foreign Key → users.id)
- `movie_id` (TMDb movie ID)
- `rating` (1-5)
- `comment` (Text)
- `created_at`

## 🔧 Configuration

### Backend (`backend/src/main/resources/application.properties`)

```properties
# Server
server.port=8080

# Database (H2 - Development)
spring.datasource.url=jdbc:h2:file:./data/moviedash
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JWT
jwt.secret=your-256-bit-secret-key
jwt.expiration=86400000

# CORS
cors.allowed-origins=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend Environment Variables

See the Frontend Setup section above for required environment variables.

## 🐛 Troubleshooting

### Backend won't start
- Ensure Java 17+ is installed: `java -version`
- Check if port 8080 is available
- Verify Maven is installed: `mvn -version`

### Frontend won't start
- Ensure Node.js is installed: `node -version`
- Try deleting `node_modules` and running `npm install` again
- Check that port 3000 is available

### Authentication issues
- Ensure backend is running on `http://localhost:8080`
- Check browser console for CORS errors
- Verify JWT secret is set in backend configuration

### TMDb API errors
- Verify your API key is correct
- Check your API key usage limits on TMDb
- Ensure `REACT_APP_TMDB_API_KEY` is set in frontend `.env`

### Database issues
- H2 database is created automatically on first run
- Database file location: `backend/data/moviedash.mv.db`
- To reset: delete the database file and restart the backend

## 📝 Development Notes

- The backend uses **H2 database** by default for easy development setup
- For production, uncomment MySQL configuration in `application.properties`
- CORS is configured for `http://localhost:3000` - update if using a different port
- JWT tokens are stored in `localStorage` on the frontend

## 🚢 Production Deployment

### Backend
1. Build the JAR: `mvn clean package`
2. Configure MySQL database
3. Set production environment variables
4. Run: `java -jar target/movie-dash-backend-1.0.0.jar`

### Frontend
1. Build for production: `npm run build`
2. Serve the `build/` directory with a web server (nginx, Apache, etc.)
3. Configure environment variables on your hosting platform

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the movie data API
- Material-UI team for the excellent component library
- Spring Boot team for the robust backend framework

---

**Made with ❤️ using React and Spring Boot**
