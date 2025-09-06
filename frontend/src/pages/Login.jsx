import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { loginUser } from '../utils/api';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);
            console.log('Login response:', response);

            if (response.success && response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);

                // ✅ Pass both token AND user data to login for immediate navigation
                login(response.data.token, response.data.user);

                // ✅ Use replace to prevent going back to login page
                navigate('/dashboard', { replace: true });
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error('Login error:', err);
            
            // ✅ Better error handling with more specific messages
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 401) {
                setError('Invalid email or password. Please try again.');
            } else {
                setError('Failed to login. Please check your credentials.');
            }
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn">Login</button>
                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
