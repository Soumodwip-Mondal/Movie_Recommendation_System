# 🎬 CinePulse - Movie Recommendation System

A full-stack movie recommendation platform with personalized suggestions, user authentication, and interactive movie browsing powered by TMDB API.

---

## 🌟 Features

### 🔐 Authentication
- **Sign Up / Login**: Secure user registration with JWT tokens
- **Protected Routes**: Automatic redirect for unauthenticated users
- **Session Management**: Token-based authentication with logout

### 🎬 Movie Discovery
- **Cold Start Recommendations**: Get 30 random movies to start
- **Search**: Find movies and get similar recommendations
- **Top Rated**: Browse highest-rated movies
- **Genre Filtering**: Filter by Action, Thriller, Drama, Sci-Fi, Comedy, Horror
- **Watch History**: Automatic tracking of watched movies

### 👤 Profile Dashboard
- User information display (name, email, join date)
- Viewing stats (total watched, saved)
- Genre-wise viewing progress with progress bars
- Logout functionality

### 🎞️ Interactive Movie Cards
- Movie posters with ratings
- Play button to add to history
- Save to favorites
- Hover effects and smooth animations

### 📱 Responsive Design
- Mobile-first approach
- Bottom navigation for mobile
- Beautiful dark theme
- Smooth transitions

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with React Router
- **Vite** for fast development
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **FastAPI** (Python 3.11+)
- **MongoDB** for database
- **JWT** for authentication
- **TMDB API** for movie data
- **Pydantic** for validation

---

## 🚀 Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local or cloud)
- TMDB API key (get from https://www.themoviedb.org/settings/api)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Recommendation_System/backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the server**
   ```bash
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

Backend will be available at: **http://127.0.0.1:8000**  
API docs: **http://127.0.0.1:8000/docs**

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd Recommendation_System/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

Frontend will be available at: **http://localhost:5173**

---

## 📱 Usage

### First Visit
1. Navigate to http://localhost:5173
2. Click **Sign Up** on the landing page
3. Fill in name, email, password, and select favorite genres
4. You'll be automatically logged in and redirected to home

### Browse Movies
- **Home**: Personalized recommendations
- **Genres**: Filter movies by genre
- **Top Rated**: Browse highest-rated movies
- **Search**: Find specific movies (in header)
- **My List**: View your watch history

### Interact
- **Click Play**: Adds movie to history
- **Click Heart**: Save to favorites
- **Search Movies**: Get similar recommendations

### Profile
- Go to **My Space** to view profile
- See viewing stats and preferences
- Click **Logout** to end session

---

## 🔌 API Endpoints

### Authentication
- `POST /api/signup` - Register new user
- `POST /api/login` - User login
- `GET /api/current_user` - Get authenticated user

### Recommendations
- `GET /api/cold-sample` - Get 30 random movies
- `GET /api/top_6?name={movie}` - Get 6 similar movies
- `GET /api/top_6_to_12?name={movie}` - Get movies 7-12

### History
- `GET /api/user/history/` - Get user watch history
- `POST /api/user/history/` - Add movie to history

---

## 📚 Project Structure

```
Movie_Remommendation_System/
├── Recommendation_System/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── auth/          # Authentication
│   │   │   ├── config/        # Config
│   │   │   ├── database/      # MongoDB
│   │   │   ├── models/        # Data models
│   │   │   ├── routes/        # API endpoints
│   │   │   ├── schemas/       # Pydantic
│   │   │   └── recommendation_model/
│   │   ├── main.py
│   │   └── .env
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── lib/
│       │   └── App.jsx
│       ├── package.json
│       └── vite.config.js
└── README.md
```

---

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file with correct values
- Ensure port 8000 is free

### Movies not loading
- Verify TMDB API key is valid
- Check backend logs for errors
- Check internet connection

### Authentication not working
- Clear browser localStorage
- Check SECRET_KEY in `.env`
- Verify MongoDB connection

---

## 🚀 Future Enhancements

- [ ] User ratings and reviews
- [ ] Social features (follow, share)
- [ ] Advanced filters (year, language)
- [ ] Email notifications
- [ ] Collaborative filtering
- [ ] Movie trailers

---

## 👍 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 👤 Author

Built with ❤️ by **Soumo**

---

**Note**: This is a learning project. Additional security hardening needed for production.
