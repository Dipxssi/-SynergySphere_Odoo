import React, { createContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            try {
                const response = await api.get('/auth/me');
                console.log('User profile response:', response.data);
                // ✅ Fixed: Use correct response path
                setUser(response.data.data.user);
            } catch (error) {
                console.error('Load user error:', error);
                localStorage.removeItem('token');
                setAuthToken(null);
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    // ✅ Updated login function to accept user data directly
    const login = (token, userData = null) => {
        console.log('AuthContext login called - Token:', !!token, 'UserData:', !!userData);
        
        localStorage.setItem('token', token);
        setAuthToken(token);
        
        if (userData) {
            // Set user data directly from login response (faster)
            console.log('Setting user data directly:', userData);
            setUser(userData);
            setLoading(false);
        } else {
            // Fallback to API call if no user data provided
            console.log('Loading user from API');
            loadUser();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
        setLoading(false);
    };

    const value = {
        user,
        login,
        logout,
        loading,
        // ✅ Export loadUser in case you need it elsewhere
        loadUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
