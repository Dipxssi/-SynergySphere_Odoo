import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete api.defaults.headers.common['x-auth-token'];
    }
};

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const getUserProfile = async () => {
    const response = await api.get('/profile');
    return response.data;
};

export const updateUserProfile = async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
};

export const getProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

export const getProject = async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

export const getTask = async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
};

export const updateTask = async (id, updates) => {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data;
};

export const getNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

export default api;
