import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/api/auth/login', formData);
            login(response.data);
            navigate('/');
        } catch (err) {
            setError(err.userMessage || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Sign In</h2>
                {error && <p className="auth-error">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    className="auth-input"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="auth-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <p className="auth-link">
                    New to KaanFlix?{' '}
                    <span onClick={() => navigate('/register')}>Sign up now.</span>
                </p>
            </form>
        </div>
    );
};

export default Login;
