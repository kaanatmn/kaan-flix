import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import api from './api/axiosConfig';
import MovieCard from './components/MovieCard';
import SearchBar from './components/SearchBar';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import MovieDetail from './components/MovieDetail';
import MyLists from './components/MyLists';
import BrowseLists from './components/BrowseLists';
import ListDetail from './components/ListDetail';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import './App.css';

function App() {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const endpoint = searchQuery
                    ? `/api/movies/search?query=${encodeURIComponent(searchQuery)}`
                    : '/api/movies/popular';
                const response = await api.get(endpoint);
                const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
                setMovies(data.results || []);
            } catch (err) {
                console.error('Failed to fetch movies:', err);
            }
        };
        fetchMovies();
    }, [searchQuery]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        navigate('/');
    };

    return (
        <div className="app">
            <header className="header">
                <h1 className="brand" onClick={() => { setSearchQuery(''); navigate('/'); }}>
                    KaanFlix
                </h1>
                <SearchBar onSearch={handleSearch} />
                <nav className="header-nav">
                    {user && (
                        <button className="nav-btn" onClick={() => navigate('/my-lists')}>
                            My Lists
                        </button>
                    )}
                    {user ? (
                        <div className="user-badge" onClick={() => navigate('/profile')}>
                            <span className="user-badge-name">{user.username}</span>
                            <div className="user-avatar">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    ) : (
                        <button className="auth-button" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                    )}
                </nav>
            </header>

            <Routes>
                <Route path="/" element={
                    <div className="movie-container">
                        {movies.length > 0 ? (
                            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
                        ) : (
                            <p className="empty-state">No movies found</p>
                        )}
                    </div>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/profile" element={
                    <ProtectedRoute><UserProfile /></ProtectedRoute>
                } />
                <Route path="/my-lists" element={
                    <ProtectedRoute><MyLists /></ProtectedRoute>
                } />
                <Route path="/browse-lists" element={
                    <ProtectedRoute><BrowseLists /></ProtectedRoute>
                } />
                <Route path="/list/:id" element={<ListDetail />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
