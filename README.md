# 🎬 KaanFlix - Movie Database & List Management Platform

A full-stack movie browsing and list management application built with **Spring Boot**, **React**, and **PostgreSQL**. KaanFlix allows users to discover movies, create personalized watchlists, and share their favorite film collections with the community. (Implemented different features inspired by Netflix, IMDB, Reddit, Spotify.)

---

## Features:

### 🔐 **User Authentication & Profile Management**
- Secure user registration and login with BCrypt password encryption
- Profile customization with username and email updates
- Password change with current password verification
- Auto-generated profile avatars based on username

### 🎥 **Movie Discovery**
- Browse popular movies powered by **TMDB API**
- Search functionality with real-time results
- Detailed movie information including:
  - Plot synopsis and taglines
  - Cast with actor/actress photos
  - Director and crew information
  - Genres and ratings
  - Runtime and release dates
  - Embedded YouTube trailers

### 📋 **Movie List Management**
- Create unlimited public or private movie lists
- Add movies to multiple lists
- Remove movies from lists
- Delete entire lists
- View movie count per list

### 🌐 **Social Features**
- Browse public lists from all users
- Like public lists to add them to your library
- View all lists you've liked
- See like counts on public lists
- Cannot like your own public lists (validation)

### 🎨 **Modern UI/UX**
- Netflix-inspired dark theme
- Responsive design for all screen sizes
- Smooth animations and hover effects
- Modal-based forms for clean interactions
- Sticky navigation with user context

---

## 🛠️ Tech Stack:

### **Backend**
- **Java 21** - Modern Java features and performance
- **Spring Boot 4.0.1** - Application framework
- **Spring Data JPA** - Database abstraction and ORM
- **Spring Security** - Authentication and password encryption (BCrypt)
- **PostgreSQL** - Relational database
- **Maven** - Dependency management and build tool
- **Lombok** - Boilerplate code reduction

### **Frontend**
- **React 18** - UI library with hooks
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast development build tool
- **CSS3** - Custom styling with modern features

### **External APIs**
- **TMDB API** - Movie data and images

### **Development Tools**
- **pgAdmin 4** - PostgreSQL database management
- **Git** - Version control
- **VS Code** - IDE

---

## 🔮 Future Enhancements:

- [ ] User reviews and ratings system
- [ ] Advanced search filters (genre, year, rating)
- [ ] Watchlist with "watched" status tracking
- [ ] Social features (follow users, activity feed)
- [ ] Movie recommendations based on user lists
- [ ] Email notifications for list likes
- [ ] Export lists to PDF or share via link
- [ ] Dark/Light theme toggle
- [ ] Movie trailers autoplay on hover
- [ ] List collaboration (multiple owners)

---

(Screenshots of the app coming soon!)







