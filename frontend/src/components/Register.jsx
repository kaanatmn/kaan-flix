import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.userMessage || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2 className="auth-title">Sign Up</h2>
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
                    type="email"
                    placeholder="Email"
                    className="auth-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    className="auth-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? 'Creating account...' : 'Sign Up'}
                </button>
                <p className="auth-link">
                    Already have an account?{' '}
                    <span onClick={() => navigate('/login')}>Sign in.</span>
                </p>
            </form>
        </div>
    );
};

export default Register;
