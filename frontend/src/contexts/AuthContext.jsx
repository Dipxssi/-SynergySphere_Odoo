import React, { createContext, useState, useEffect } from 'react';
import { setAuthToken } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            // In a real app, you'd verify the token with the backend and get user info
            // For now, we'll just assume the token is valid and decode it
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            setUser(decodedToken);
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthToken(token);
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser(decodedToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
