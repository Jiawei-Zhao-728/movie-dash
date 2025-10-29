# MovieDash Backend Setup Guide

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (or use H2 for development)

## Environment Variables

Create a `.env` file in the backend directory (copy from `.env.example`):

```bash
# Google OAuth2 Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Database Setup

### Option 1: MySQL (Recommended for Production)

1. Install MySQL if not already installed
2. The application will automatically create the database on first run
3. Update credentials in `application.properties` if needed:
   - Default username: `root`
   - Default password: `password`
   - Default database: `moviedash`

### Option 2: H2 Database (For Development)

To use H2 instead of MySQL, update `application.properties`:

```properties
# Comment out MySQL configuration
# spring.datasource.url=jdbc:mysql://localhost:3306/moviedash...

# Add H2 configuration
spring.datasource.url=jdbc:h2:file:./data/moviedash
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## Google OAuth2 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:8080/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

## Running the Application

### Build the project:

```bash
mvn clean install
```

### Run the application:

```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `GET /auth/google` - Google OAuth login

### Favorites

- `GET /favorites` - Get user's favorites
- `POST /favorites` - Add to favorites
- `DELETE /favorites/{movieId}` - Remove from favorites

### Reviews

- `GET /reviews/movie/{movieId}` - Get reviews for a movie
- `POST /reviews` - Create a review
- `PUT /reviews/{id}` - Update a review
- `DELETE /reviews/{id}` - Delete a review

## Configuration

### JWT Token

- Default expiration: 24 hours (86400000 ms)
- Change the secret key in production!
- Secret key should be at least 256 bits

### CORS

- Default allowed origins: `http://localhost:3000`, `http://127.0.0.1:3000`
- Modify in `application.properties`: `cors.allowed-origins`

## Troubleshooting

### Port already in use

If port 8080 is already in use, change it in `application.properties`:

```properties
server.port=8081
```

### Database connection error

1. Make sure MySQL is running
2. Check username/password in `application.properties`
3. Ensure database exists or set `createDatabaseIfNotExist=true`

### Lombok errors

If you see Lombok-related errors, ensure your IDE has Lombok plugin installed:

- IntelliJ IDEA: Install Lombok plugin
- Eclipse: Install Lombok
- VS Code: Install Lombok Annotations Support

## Next Steps

1. Implement business logic in service classes
2. Complete controller endpoints
3. Add unit tests
4. Configure production database
5. Set up proper JWT secret key
6. Add API documentation (Swagger/OpenAPI)
