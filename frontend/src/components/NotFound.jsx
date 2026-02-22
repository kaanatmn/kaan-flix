import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '100px 20px', color: 'white' }}>
            <h1 style={{ fontSize: '6rem', margin: 0, color: '#e50914' }}>404</h1>
            <p style={{ fontSize: '1.5rem', color: '#aaa', margin: '20px 0' }}>Page not found</p>
            <button onClick={() => navigate('/')}
                style={{ padding: '12px 30px', backgroundColor: '#e50914', color: 'white',
                    border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer' }}>
                Go Home
            </button>
        </div>
    );
};

export default NotFound;