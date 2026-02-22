import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './Lists.css';

const BrowseLists = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [publicLists, setPublicLists] = useState([]);
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const loadPublicLists = async () => {
            try {
                const response = await api.get(`/api/lists/public?currentUserId=${user.id}`);
                setPublicLists(response.data);
            } catch {
                /* handled */
            }
        };
        loadPublicLists();
    }, [user.id, refresh]);

    const handleLikeList = async (listId, isCurrentlyLiked) => {
        try {
            if (isCurrentlyLiked) {
                await api.delete(`/api/lists/likes?userId=${user.id}&listId=${listId}`);
            } else {
                await api.post('/api/lists/likes', { userId: user.id, listId });
            }
            setRefresh(r => r + 1);
        } catch (err) {
            alert(err.userMessage || 'Failed to like/unlike list');
        }
    };

    return (
        <div className="lists-page">
            <div className="lists-header">
                <h1>Browse Public Lists</h1>
                <button className="back-btn" onClick={() => navigate('/my-lists')}>
                    ← Back to My Lists
                </button>
            </div>

            <div className="lists-grid">
                {publicLists.length === 0 ? (
                    <p className="no-lists">No public lists available yet.</p>
                ) : (
                    publicLists.map(list => (
                        <div key={list.id} className="list-card">
                            <div className="list-card-clickable" onClick={() => navigate(`/list/${list.id}`)}>
                                <div className="list-card-header">
                                    <h3>{list.name}</h3>
                                    <span className="public-badge">Public</span>
                                </div>
                                <p className="list-description">{list.description || 'No description'}</p>
                                <div className="list-meta">
                                    <span>🎬 {list.movieCount} movies</span>
                                    <span>by {list.username}</span>
                                </div>
                            </div>
                            {list.userId !== user.id && (
                                <button className={`like-btn ${list.isLiked ? 'liked' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleLikeList(list.id, list.isLiked); }}>
                                    {list.isLiked ? '❤️ Liked' : '🤍 Like'} ({list.likeCount || 0})
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BrowseLists;
