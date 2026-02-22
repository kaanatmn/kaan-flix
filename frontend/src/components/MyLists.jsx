import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './Lists.css';

const MyLists = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [myLists, setMyLists] = useState([]);
    const [likedLists, setLikedLists] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newListData, setNewListData] = useState({ name: '', description: '', isPublic: false });
    const [activeTab, setActiveTab] = useState('my');
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        const loadLists = async () => {
            try {
                const [myRes, likedRes] = await Promise.all([
                    api.get(`/api/lists/user/${user.id}`),
                    api.get(`/api/lists/liked/${user.id}`)
                ]);
                setMyLists(myRes.data);
                setLikedLists(likedRes.data);
            } catch {
                /* handled */
            }
        };
        loadLists();
    }, [user.id, refresh]);

    const handleCreateList = async (e) => {
        e.preventDefault();
        setError('');
        if (!newListData.name.trim()) {
            setError('List name is required');
            return;
        }
        try {
            await api.post('/api/lists', { userId: user.id, ...newListData });
            setShowCreateModal(false);
            setNewListData({ name: '', description: '', isPublic: false });
            setRefresh(r => r + 1);
        } catch (err) {
            setError(err.userMessage || 'Failed to create list');
        }
    };

    const handleDeleteList = async (listId) => {
        if (!window.confirm('Are you sure you want to delete this list?')) return;
        try {
            await api.delete(`/api/lists/${listId}?userId=${user.id}`);
            setRefresh(r => r + 1);
        } catch (err) {
            alert(err.userMessage || 'Failed to delete list');
        }
    };

    const listsToShow = activeTab === 'my' ? myLists : likedLists;

    return (
        <div className="lists-page">
            <div className="lists-header">
                <h1>My Movie Lists</h1>
                <button className="create-list-btn" onClick={() => setShowCreateModal(true)}>
                    + Create New List
                </button>
            </div>

            <div className="tabs">
                <button className={`tab ${activeTab === 'my' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my')}>
                    My Lists ({myLists.length})
                </button>
                <button className={`tab ${activeTab === 'liked' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liked')}>
                    Liked Lists ({likedLists.length})
                </button>
                <button className="tab" onClick={() => navigate('/browse-lists')}>
                    Browse Public Lists
                </button>
            </div>

            <div className="lists-grid">
                {listsToShow.length === 0 ? (
                    <p className="no-lists">
                        {activeTab === 'my'
                            ? "You haven't created any lists yet. Create one to get started!"
                            : "You haven't liked any lists yet. Browse public lists to find some!"}
                    </p>
                ) : (
                    listsToShow.map(list => (
                        <div key={list.id} className="list-card" onClick={() => navigate(`/list/${list.id}`)}>
                            <div className="list-card-header">
                                <h3>{list.name}</h3>
                                {list.isPublic && <span className="public-badge">Public</span>}
                            </div>
                            <p className="list-description">{list.description || 'No description'}</p>
                            <div className="list-meta">
                                <span>🎬 {list.movieCount} movies</span>
                                <span>by {list.username}</span>
                            </div>
                            {activeTab === 'my' && (
                                <button className="delete-btn" onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteList(list.id);
                                }}>Delete</button>
                            )}
                        </div>
                    ))
                )}
            </div>

            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Create New List</h2>
                        {error && <p className="auth-error" style={{ marginBottom: '15px' }}>{error}</p>}
                        <form onSubmit={handleCreateList}>
                            <input type="text" placeholder="List Name *"
                                value={newListData.name}
                                onChange={(e) => setNewListData({ ...newListData, name: e.target.value })}
                                className="modal-input" required />
                            <textarea placeholder="Description (optional)"
                                value={newListData.description}
                                onChange={(e) => setNewListData({ ...newListData, description: e.target.value })}
                                className="modal-textarea" rows="3" />
                            <label className="checkbox-label">
                                <input type="checkbox" checked={newListData.isPublic}
                                    onChange={(e) => setNewListData({ ...newListData, isPublic: e.target.checked })} />
                                <span>Make this list public</span>
                            </label>
                            <div className="modal-buttons">
                                <button type="submit" className="modal-btn create">Create</button>
                                <button type="button" className="modal-btn cancel"
                                    onClick={() => setShowCreateModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyLists;
