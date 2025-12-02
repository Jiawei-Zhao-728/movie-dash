# MovieDash 🎬

A modern, full-stack web application for discovering, browsing, and managing your favorite movies and TV shows. Built with React and Spring Boot, powered by The Movie Database (TMDb) API.

Designed with a **minimal tech aesthetic**, featuring smooth animations, glass morphism effects, and an industry-standard architecture suitable for portfolio and production use.

![MovieDash](https://img.shields.io/badge/React-18.2.0-blue) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green) ![Java](https://img.shields.io/badge/Java-17-orange) ![Material--UI](https://img.shields.io/badge/Material--UI-5.x-purple) ![JWT](https://img.shields.io/badge/JWT-Auth-red)

## ✨ Features

### 🌟 Standout Features (Resume Highlights)

#### 1. **Personalized Analytics Dashboard** 📊
   - **What it does**: Intelligent dashboard that analyzes your watching habits and provides personalized recommendations
   - **Why it's impressive**:
     - Real-time data aggregation from multiple sources
     - Visual genre preference analysis with animated charts
     - Calculates statistics (total watch time, average ratings)
     - **Smart recommendation algorithm** based on your top-rated favorites
     - Demonstrates: Async data handling, data visualization, complex state management
   - **Technical skills showcased**:
     - Promise.all coordination for parallel API calls
     - Data transformation and deduplication algorithms
     - Chart implementation with animated progress bars
     - Recommendation system using TMDB API

#### 2. **Side-by-Side Movie Comparison Tool** ⚖️
   - **What it does**: Compare two movies head-to-head with visual metrics
   - **Why it's impressive**:
     - Unique feature rarely seen in movie apps
     - Dual autocomplete search with debouncing
     - Visual comparison charts (rating, popularity, runtime, budget)
     - Real-time data fetching and synchronization
   - **Technical skills showcased**: Complex UI state, dual async operations, creative problem-solving

### Core Functionality
- 🎭 **Browse Movies & TV Shows** - Explore trending content with beautiful, responsive movie cards
- 🔍 **Advanced Search** - Real-time search with auto-suggestions and media type filters
- ⭐ **Favorites/Watchlist** - Save your favorite movies to a personalized watchlist
- 💬 **Reviews & Ratings** - Write and read reviews for movies with star ratings
- 📺 **Watch History** - Track your viewing history across all content
- 👤 **User Profiles** - Manage your account with a personalized profile page

### User Experience
- 🔐 **Secure Authentication** - JWT-based authentication with user registration and login
- 🎨 **Modern UI Design** - Minimal tech aesthetic with indigo/green/amber color scheme
- ✨ **Smooth Animations** - Framer Motion animations throughout the interface
- 💎 **Glass Morphism** - Modern backdrop blur effects and transparency
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🎬 **Auto-Rotating Hero** - Eye-catching hero banner with trending content
- 🎯 **Interactive Cards** - Hover effects with lift animation, shine overlay, and action buttons

### Technical Features
- 📦 **Token-Based Design System** - Centralized design tokens for consistent styling
- 🔒 **Secure Backend** - Spring Security with BCrypt password hashing
- 🗄️ **Flexible Database** - H2 for development, MySQL for production
- 📝 **Comprehensive Logging** - SLF4J logging with proper log levels
- 🌍 **CORS Configured** - Proper cross-origin resource sharing setup
- ⚙️ **Environment Configuration** - Environment variables with sensible defaults

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks and functional components
- **Material-UI (MUI)** - Component library with custom theme
- **React Router v6** - Client-side navigation
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API calls
- **Context API** - State management (Auth, Watchlist)
- **Lodash** - Utility functions (debouncing, etc.)

### Backend
- **Spring Boot 3.2.0** - Java framework with auto-configuration
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database abstraction layer
- **JWT (JSON Web Tokens)** - Stateless authentication
- **H2 Database** - Embedded database for development
- **MySQL** - Production database (optional)
- **Lombok** - Boilerplate reduction (@Slf4j, @RequiredArgsConstructor, etc.)
- **SLF4J** - Structured logging framework

### External APIs
- **TMDb API v3** - Movie and TV show data, images, and metadata

## 🏗️ Architecture

### Design Patterns
- **MVC (Model-View-Controller)** - Backend architecture
- **Component-Based Architecture** - Frontend structure
- **Repository Pattern** - Data access abstraction
- **DTO Pattern** - Data transfer between layers
- **Context Provider Pattern** - Frontend state management
- **Token-Based Design System** - Centralized design decisions

### Code Quality
- **Comprehensive Documentation** - JSDoc for JavaScript, Javadoc for Java
- **Environment Configuration** - `.env.example` templates for both frontend and backend
- **Proper Error Handling** - Global exception handler with standardized responses
- **Structured Logging** - SLF4J with appropriate log levels (DEBUG, INFO, WARN, ERROR)
- **Security Best Practices** - BCrypt password hashing, JWT token validation, CORS configuration
- **Responsive Design** - Mobile-first approach with Material-UI breakpoints

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

The backend supports configuration via environment variables. A template file `.env.example` is provided in the `backend/` directory.

**Quick Start (Development):**
```bash
# Copy the example file
cp .env.example .env

# Edit .env and update the following:
# - JWT_SECRET: Generate a secure secret (recommended: openssl rand -base64 64)
# - Database credentials (if using MySQL)
```

**Minimal Configuration:**
The backend will work out of the box with default settings. The only critical setting for production is:

```bash
# In backend/.env or as environment variable
JWT_SECRET=your-256-bit-secret-key-please-change-this-in-production-environment
```

The backend uses **H2 database** by default for development (no additional setup required). The database file will be created automatically in `backend/data/moviedash.mv.db`.

For production, see the `.env.example` file for MySQL configuration options.

#### Run the Backend

```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Verify Backend is Running:**
```bash
curl http://localhost:8080/auth/test
# Expected response: {"success":true,"message":"MovieDash API is working!","data":{"status":"running"}}
```

**H2 Database Console (Development):** `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/moviedash`
- Username: `sa`
- Password: (leave empty)

### 3. Frontend Setup

#### Navigate to the frontend directory (root of project)

```bash
# From backend directory, go back to root
cd ..

# Install dependencies
npm install
```

#### Configure Environment Variables

A template file `.env.example` is provided in the root directory.

```bash
# Copy the example file
cp .env.example .env

# Edit .env and update with your TMDb API credentials
```

**Required Configuration:**
You need to get TMDb API credentials from [The Movie Database](https://www.themoviedb.org/):

1. **Create a TMDb Account** - Sign up at [themoviedb.org](https://www.themoviedb.org/)
2. **Get API Key** - Navigate to [Settings > API](https://www.themoviedb.org/settings/api)
3. **Generate Read Access Token** - Follow the instructions in the API section

Then update your `.env` file:

```bash
# TMDb API Configuration
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
REACT_APP_TMDB_API_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_API_READ_ACCESS_TOKEN=your_tmdb_read_access_token_here

# Backend API URL (default: http://localhost:8080)
REACT_APP_API_BASE_URL=http://localhost:8080
```

#### Run the Frontend

```bash
npm start
```

The frontend will start on `http://localhost:3000` and automatically open in your default browser.

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
