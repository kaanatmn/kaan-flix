# 🎬 KaanFlix

A full-stack movie database and social watchlist platform built with **Spring Boot** and **React**. Users can browse movies via the TMDB API, build curated watchlists, and share their collections with the community through a like-based social system.

**Inspired by the best features of Netflix, IMDb, Letterboxd, and Spotify playlists.**

---

## Features

**Movie Discovery** — Browse trending movies, search the TMDB catalog, view detailed movie pages with cast, crew, trailers, and ratings.

**Watchlist Management** — Create unlimited public or private movie lists, add/remove movies, and organize your collection.

**Social Layer** — Browse community lists, like public lists from other users, and track your favorites.

**User Accounts** — Secure registration/login with BCrypt password hashing, profile management with password-verified email changes.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Language |
| Spring Boot 4.0 | Application framework |
| Spring Data JPA | ORM & database abstraction |
| Spring Security | Authentication & password encryption |
| Spring Validation | Request DTO validation (Jakarta Bean Validation) |
| PostgreSQL | Relational database |
| Maven | Build & dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library (hooks, context) |
| React Router 7 | Client-side routing with protected routes |
| Axios | HTTP client with interceptors |
| Vite 7 | Dev server & build tool |
| CSS3 | Custom styling (CSS variables, grid, flexbox) |

### External
| Service | Purpose |
|---|---|
| TMDB API | Movie data, images, trailers |

---

## Architecture

```
┌─────────────────┐         ┌──────────────────────────────────────┐
│                 │  HTTP   │            Spring Boot API            │
│   React SPA     │◄───────►│                                      │
│   (Vite)        │  JSON   │  Controller → Service → Repository   │
│                 │         │       ↓           ↓          ↓       │
│  AuthContext     │         │  Validation   Business    JPA/SQL    │
│  ProtectedRoute  │         │  (DTOs)       Logic      (Postgres)  │
│  Axios Client   │         │                                      │
└─────────────────┘         └──────────────┬───────────────────────┘
                                           │
                            ┌──────────────▼───────────────────────┐
                            │          PostgreSQL                   │
                            │  users │ movie_lists │ movie_list_items │ list_likes  │
                            └──────────────────────────────────────┘
```

### Backend Structure
```
backend/src/main/java/com/kaanflix/backend/
├── config/          # Security, CORS, RestTemplate bean
├── controller/      # REST endpoints (Auth, Movie, MovieList, User)
├── dto/
│   ├── request/     # Validated request DTOs (LoginRequest, CreateListRequest, etc.)
│   └── response/    # Response DTOs (MovieListResponse, ApiResponse, etc.)
├── entity/          # JPA entities (User, MovieList, MovieListItem, ListLike)
├── exception/       # Global exception handler + custom exceptions
├── repository/      # Spring Data JPA repositories
└── service/         # Business logic layer
```

### Frontend Structure
```
frontend/src/
├── api/             # Axios instance with interceptors
├── components/      # UI components (MovieCard, SearchBar, etc.)
├── context/         # AuthContext (centralized auth state)
├── App.jsx          # Root component with routing
└── main.jsx         # Entry point with providers
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and receive user data |

### Movies (TMDB Proxy)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies/popular` | Get popular movies |
| GET | `/api/movies/search?query=` | Search movies |
| GET | `/api/movies/{id}` | Get movie details with credits & trailers |

### Movie Lists
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/lists` | Create a new list |
| GET | `/api/lists/user/{userId}` | Get user's lists |
| GET | `/api/lists/public?currentUserId=` | Get all public lists |
| GET | `/api/lists/liked/{userId}` | Get user's liked lists |
| GET | `/api/lists/{listId}` | Get list details with movies |
| DELETE | `/api/lists/{listId}?userId=` | Delete a list |

### List Movies
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/lists/movies` | Add movie to list |
| DELETE | `/api/lists/movies/{itemId}?userId=` | Remove movie from list |

### Likes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/lists/likes` | Like a public list |
| DELETE | `/api/lists/likes?userId=&listId=` | Unlike a list |

### User Profile
| Method | Endpoint | Description |
|---|---|---|
| PUT | `/api/users/username` | Update username |
| PUT | `/api/users/email` | Update email (requires password) |
| PUT | `/api/users/password` | Update password (requires current password) |

---

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL 15+
- TMDB API key ([get one here](https://www.themoviedb.org/settings/api))

### Database Setup
```sql
CREATE DATABASE kaanflix_db;
```

### Backend
```bash
cd backend

# Copy the template and fill in your credentials
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your TMDB API key and database password

# Run with Maven
./mvnw spring-boot:run
```

The API starts at `http://localhost:8080`.

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env if your backend runs on a different port

# Start dev server
npm run dev
```

The app opens at `http://localhost:5173`.

---

## Database Schema

```
users
├── id (PK)
├── username (UNIQUE)
├── email (UNIQUE)
├── password (BCrypt hash)
└── created_at

movie_lists
├── id (PK)
├── user_id (FK → users)
├── name
├── description
├── is_public
└── created_at

movie_list_items
├── id (PK)
├── list_id (FK → movie_lists, CASCADE)
├── tmdb_movie_id
├── movie_title
├── poster_path
└── added_at

list_likes
├── id (PK)
├── user_id (FK → users)
├── list_id (FK → movie_lists, CASCADE)
├── liked_at
└── UNIQUE(user_id, list_id)
```

---

## Design Decisions

- **No JWT** — Session-less design with client-side user state. Keeps the auth flow simple while still using BCrypt for password security. JWT would be the natural next step for production.
- **TMDB proxy** — All movie API calls go through the Spring Boot backend to keep the API key server-side and avoid CORS issues.
- **Response DTOs** — All API responses use typed DTOs instead of raw entities, ensuring consistent JSON contracts and preventing entity leakage. Response DTOs use explicit Java (no Lombok) for full IDE compatibility, while entities and request DTOs use Lombok for boilerplate reduction.
- **Global exception handler** — Centralized error handling with `@RestControllerAdvice` returns structured error responses with proper HTTP status codes.
- **Custom exception hierarchy** — Typed exceptions (`ResourceNotFoundException`, `DuplicateResourceException`, `UnauthorizedException`, `BadRequestException`) map directly to HTTP status codes for clear, predictable API behavior.
- **AuthContext** — React Context API provides centralized auth state, eliminating scattered `localStorage` calls across components.
- **Cascade deletes** — Deleting a list automatically removes all its items and likes via JPA cascade, maintaining referential integrity.
- **Axios interceptors** — Centralized error handling extracts user-friendly messages from API error responses, keeping component code clean.
