# Movie Recommendation System Backend

This repository contains the backend implementation for a Movie Recommendation System. Built using **Express.js** and **MongoDB**, it supports user authentication, movie management, ratings, reviews, personalized recommendations, and more. The API is documented using Postman, adhering to best practices for file structure, naming conventions, and middleware usage.

## Project Overview

The Movie Recommendation System enables users to browse, rate, and review movies while receiving personalized recommendations based on preferences and activity. Admins manage the movie database and moderate content, with features for analytics, notifications, and community discussions. The backend is designed for scalability, security, and maintainability.

**Technologies Used**:
- **Backend**: Express.js (Node.js v16.x or later)
- **Database**: MongoDB (MongoDB Atlas recommended)
- **Authentication**: JSON Web Tokens (JWT)
- **API Documentation**: Postman
- **Dependencies**: mongoose, bcrypt, jsonwebtoken, nodemailer, dotenv

## Project Structure

```plaintext
.
├── src/
│   ├── controllers/         # Request handlers for API endpoints
│   ├── middleware/         # Authentication and error-handling middleware
│   ├── models/             # MongoDB schemas (User, Movie, Review, etc.)
│   ├── routes/             # Express route definitions
│   └── index.js              # Main application entry point
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Features and Modules

### 1. User Authentication and Profiles
- **Registration/Login**: Secure user signup/login with JWT.
- **Profile Management**: Update user details and movie preferences (genres, actors).
- **Wishlist**: Add/remove movies to a personal watchlist.

### 2. Movie Database Management
- **CRUD Operations**: Admins add, update, or delete movies (title, genre, director, cast, release date, runtime, synopsis, rating).
- **Additional Details**: Include trivia, goofs, soundtrack, and age ratings.
- **Crew Profiles**: Store actor/director details (filmography, biography, awards).

### 3. Rating and Review Module
- **Rating**: Users rate movies (1-5 scale).
- **Reviews**: Create/update reviews; view others’ reviews with highlights for top-rated content.
- **Moderation**: Admins moderate reviews for compliance.

### 4. Recommendation System
- **Personalized Recommendations**: Based on user ratings, genres, and similar user activity.
- **Similar Titles**: Display related movies by genre/director on movie pages.
- **Trending/Top Rated**: Showcase trending and top-rated movies.

### 5. Watchlist and Custom Lists
- **Custom Lists**: Create/share lists (e.g., "Best Sci-Fi Movies").
- **Follow Lists**: Save or follow lists created by other users.

### 6. Search and Filtering
- **Search**: Find movies by title, genre, director, or actors.
- **Filters**: Sort by ratings, popularity, release year, decade, country, or keywords.
- **Top Lists**: Display "Top Movies of the Month" or "Top 10 by Genre".

### 7. Upcoming Releases and Notifications
- **Upcoming Movies**: List movies with release dates and reminder options.
- **Notifications**: Email/dashboard alerts for new releases or trailers.

### 8. News and Articles
- **Updates**: Display movie industry news and actor/project updates.

### 9. Box Office and Awards
- **Box Office**: Track earnings (opening weekend, total, international).
- **Awards**: List movie/actor awards (e.g., Oscars).

### 10. Community and Discussion
- **Forums**: Users discuss movies/genres in community boards.

### 11. Admin Operations
- **Database Management**: Manage movies and reviews.
- **Analytics**: View site stats (popular movies, trending genres, user engagement).

**Relationships**:
- Users reference Movies in `wishlist` and `customLists`.
- Reviews link Users and Movies.
- Lists reference Users (creator) and Movies.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/username/movie-recommendation-backend.git
   cd movie-recommendation-backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file:
   ```plaintext
   PORT=3000
   MONGODB_URI=your-mongodb-atlas-uri
   JWT_SECRET=your-jwt-secret
   NODEMAILER_EMAIL=your-email
   NODEMAILER_PASS=your-email-password
   ```

4. **Start the Server**:
   ```bash
   npm start
   ```

## API Documentation

API endpoints are documented in the `postman/MovieRecommendationAPI.json` Postman collection. Import it into Postman to explore endpoints. Below is an example:

### Example Endpoint: User Login
- **URL**: `/api/auth/login`
- **Method**: POST
- **Description**: Authenticates a user and returns a JWT token.
- **Sample Request**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "12345",
      "username": "user1",
      "email": "user@example.com"
    }
  }
  ```
- **Failure Response** (401):
  ```json
  {
    "error": "Invalid credentials"
  }
  ```

### Other Key Endpoints
- **User**: `/api/auth/register`, `/api/users/profile`, `/api/users/wishlist`
- **Movie**: `/api/movies`, `/api/movies/:id`, `/api/movies/search`
- **Review**: `/api/reviews`, `/api/reviews/:movieId`
- **Recommendation**: `/api/recommendations/personal`, `/api/recommendations/trending`
- **List**: `/api/lists`, `/api/lists/follow`
- **Admin**: `/api/admin/movies`, `/api/admin/stats`

## Middleware
- **Authentication**: JWT middleware (`middleware/auth.js`) verifies tokens for protected routes.
- **Error Handling**: Centralized error handler for consistent responses.
- **Validation**: Input validation using `express-validator` for secure data processing.

## Best Practices
- **File Structure**: Modularized controllers, routes, and models for maintainability.
- **Naming Conventions**: CamelCase for variables, kebab-case for routes.
- **Error Handling**: Consistent error responses with HTTP status codes.
- **Security**: Password hashing with bcrypt, JWT for authentication, and sanitized inputs.
- **Logging**: Winston for logging API requests and errors.

## Testing
Use Postman for API testing:
1. Import `postman/MovieRecommendationAPI.json` into Postman.
2. Test endpoints with provided sample requests.
3. Verify success/failure cases (e.g., invalid inputs, unauthorized access).

## Troubleshooting
- **Database Connection**: Ensure `MONGODB_URI` is correct and MongoDB Atlas is accessible.
- **JWT Errors**: Verify `JWT_SECRET` in `.env`.
- **API Issues**: Check server logs (`console.log` or Winston logs).

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m "Add feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License
MIT License - see `LICENSE` for details.

## Contact
- **Resources**:
  - [Postman Documentation](https://learning.postman.com/docs/publishing-your-api/api-documentation-overview/)
  - [Postman API Testing Tutorial](https://www.youtube.com/watch?v=VywxIQ2ZXw4)
