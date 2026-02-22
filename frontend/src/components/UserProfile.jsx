import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './Auth.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user, updateUser, logout } = useAuth();

    const [editingUsername, setEditingUsername] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
    const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const showFeedback = (type, message) => {
        if (type === 'error') { setError(message); setSuccess(''); }
        else { setSuccess(message); setError(''); }
        setTimeout(() => { setError(''); setSuccess(''); }, 4000);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUpdateUsername = async (e) => {
        e.preventDefault();
        if (!newUsername.trim()) return;
        try {
            const response = await api.put('/api/users/username', {
                userId: user.id, newUsername: newUsername.trim()
            });
            updateUser(response.data);
            showFeedback('success', 'Username updated');
            setEditingUsername(false);
            setNewUsername('');
        } catch (err) {
            showFeedback('error', err.userMessage);
        }
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        if (!newEmail.trim() || !currentPasswordForEmail.trim()) return;
        try {
            const response = await api.put('/api/users/email', {
                userId: user.id,
                currentPassword: currentPasswordForEmail,
                newEmail: newEmail.trim()
            });
            updateUser(response.data);
            showFeedback('success', 'Email updated');
            setEditingEmail(false);
            setNewEmail('');
            setCurrentPasswordForEmail('');
        } catch (err) {
            showFeedback('error', err.userMessage);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showFeedback('error', "Passwords don't match");
            return;
        }
        try {
            await api.put('/api/users/password', {
                userId: user.id,
                currentPassword: currentPasswordForPassword,
                newPassword
            });
            showFeedback('success', 'Password updated');
            setEditingPassword(false);
            setCurrentPasswordForPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            showFeedback('error', err.userMessage);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form profile-page">
                <div className="profile-avatar">
                    {user.username.charAt(0).toUpperCase()}
                </div>

                <h2 className="auth-title">Hi, {user.username}</h2>
                <p className="profile-email">Email: {user.email}</p>

                {error && <p className="auth-error">{error}</p>}
                {success && <p className="auth-error" style={{ borderColor: '#4caf50', color: '#4caf50', backgroundColor: 'rgba(76,175,80,0.1)' }}>{success}</p>}

                <hr className="profile-divider" />

                {/* Change Username */}
                <div className="profile-section">
                    {!editingUsername ? (
                        <button className="auth-button profile-btn" onClick={() => setEditingUsername(true)}>
                            Change Username
                        </button>
                    ) : (
                        <form onSubmit={handleUpdateUsername}>
                            <input type="text" className="auth-input profile-input" placeholder="New Username"
                                value={newUsername} onChange={(e) => setNewUsername(e.target.value)} autoFocus />
                            <div className="profile-btn-row">
                                <button type="submit" className="auth-button profile-btn-save">Save</button>
                                <button type="button" className="auth-button profile-btn-cancel"
                                    onClick={() => { setEditingUsername(false); setNewUsername(''); }}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Change Email */}
                <div className="profile-section">
                    {!editingEmail ? (
                        <button className="auth-button profile-btn" onClick={() => setEditingEmail(true)}>
                            Change Email
                        </button>
                    ) : (
                        <form onSubmit={handleUpdateEmail}>
                            <input type="email" className="auth-input profile-input" placeholder="New Email"
                                value={newEmail} onChange={(e) => setNewEmail(e.target.value)} autoFocus />
                            <input type="password" className="auth-input profile-input" placeholder="Current Password"
                                value={currentPasswordForEmail} onChange={(e) => setCurrentPasswordForEmail(e.target.value)} />
                            <div className="profile-btn-row">
                                <button type="submit" className="auth-button profile-btn-save">Save</button>
                                <button type="button" className="auth-button profile-btn-cancel"
                                    onClick={() => { setEditingEmail(false); setNewEmail(''); setCurrentPasswordForEmail(''); }}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Change Password */}
                <div className="profile-section">
                    {!editingPassword ? (
                        <button className="auth-button profile-btn" onClick={() => setEditingPassword(true)}>
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={handleUpdatePassword}>
                            <input type="password" className="auth-input profile-input" placeholder="Current Password"
                                value={currentPasswordForPassword} onChange={(e) => setCurrentPasswordForPassword(e.target.value)} autoFocus />
                            <input type="password" className="auth-input profile-input" placeholder="New Password (min 6 characters)"
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <input type="password" className="auth-input profile-input" placeholder="Confirm New Password"
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <div className="profile-btn-row">
                                <button type="submit" className="auth-button profile-btn-save">Save</button>
                                <button type="button" className="auth-button profile-btn-cancel"
                                    onClick={() => { setEditingPassword(false); setCurrentPasswordForPassword(''); setNewPassword(''); setConfirmPassword(''); }}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>

                <hr className="profile-divider" />

                <button onClick={handleLogout} className="auth-button" style={{ width: '100%' }}>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default UserProfile;
