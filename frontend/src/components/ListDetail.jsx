import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './Lists.css';

const ListDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchList = useCallback(async () => {
        try {
            const response = await api.get(`/api/lists/${id}`);
            setList(response.data);
        } catch {
            setList(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    const handleRemoveMovie = async (itemId) => {
        if (!window.confirm('Remove this movie from the list?')) return;
        try {
            await api.delete(`/api/lists/movies/${itemId}?userId=${user.id}`);
            fetchList();
        } catch (err) {
            alert(err.userMessage || 'Failed to remove movie');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (!list) return <div className="loading">List not found</div>;

    const isOwner = user && list.userId === user.id;

    return (
        <div className="list-detail-page">
            <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

            <div className="list-detail-header">
                <div>
                    <h1>{list.name}</h1>
                    {list.isPublic && <span className="public-badge">Public</span>}
                    <p className="list-owner">by {list.username}</p>
                    {list.description && <p className="list-description">{list.description}</p>}
                </div>
                <div className="list-stats">
                    <span>🎬 {list.movies?.length || 0} movies</span>
                </div>
            </div>

            <div className="movie-grid">
                {!list.movies || list.movies.length === 0 ? (
                    <p className="no-movies">This list is empty. Add some movies!</p>
                ) : (
                    list.movies.map(item => (
                        <div key={item.id} className="movie-item">
                            <img src={`https://image.tmdb.org/t/p/w500${item.posterPath}`}
                                alt={item.movieTitle} className="movie-item-poster"
                                onClick={() => navigate(`/movie/${item.tmdbMovieId}`)} />
                            <h4>{item.movieTitle}</h4>
                            {isOwner && (
                                <button className="remove-movie-btn" onClick={() => handleRemoveMovie(item.id)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListDetail;
