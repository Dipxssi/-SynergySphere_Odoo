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

// Mock API functions
const mockProjects = [
    { _id: '1', name: 'SynergySphere Development', description: 'Develop the SynergySphere platform', tasks: [{ _id: '101', name: 'Design UI', status: 'Done' }, { _id: '102', name: 'Develop Frontend', status: 'In Progress' }], members: [{ _id: '1', name: 'Alice' }, { _id: '2', name: 'Bob' }], discussions: [{ _id: '1', text: 'What do you think about the new design?', author: { name: 'Alice' } }] },
    { _id: '2', name: 'Marketing Campaign', description: 'Plan and execute marketing campaign', tasks: [{ _id: '201', name: 'Create Ad Copy', status: 'To-Do' }], members: [{ _id: '1', name: 'Alice' }, { _id: '3', name: 'Charlie' }], discussions: [] },
];

const mockTasks = {
    '101': { _id: '101', name: 'Design UI', description: 'Design the user interface for the application.', status: 'Done', dueDate: new Date() },
    '102': { _id: '102', name: 'Develop Frontend', description: 'Build the frontend of the application using React.', status: 'In Progress', dueDate: new Date() },
    '201': { _id: '201', name: 'Create Ad Copy', description: 'Write compelling ad copy for the new campaign.', status: 'To-Do', dueDate: new Date() },
};

const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
};

// Mock token (in a real app, this would be a real JWT)
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const loginUser = async (credentials) => {
    console.log('Logging in with:', credentials);
    return Promise.resolve({ token: mockToken });
};

export const registerUser = async (userData) => {
    console.log('Registering user:', userData);
    return Promise.resolve({ token: mockToken });
};

export const getUserProfile = async () => {
    return Promise.resolve(mockUser);
};

export const updateUserProfile = async (profileData) => {
    console.log('Updating profile:', profileData);
    return Promise.resolve({ ...mockUser, ...profileData });
};

export const getProjects = async () => {
    return Promise.resolve(mockProjects);
};

export const getProject = async (id) => {
    const project = mockProjects.find(p => p._id === id);
    return project ? Promise.resolve(project) : Promise.reject('Project not found');
};

export const getTask = async (id) => {
    const task = mockTasks[id];
    return task ? Promise.resolve(task) : Promise.reject('Task not found');
};

export const updateTask = async (id, updates) => {
    console.log(`Updating task ${id} with:`, updates);
    if (mockTasks[id]) {
        mockTasks[id] = { ...mockTasks[id], ...updates };
        return Promise.resolve(mockTasks[id]);
    }
    return Promise.reject('Task not found');
};

export const getNotifications = async () => {
    return Promise.resolve([
        { _id: '1', message: 'New task assigned to you.' },
        { _id: '2', message: 'Project deadline approaching.' },
    ]);
};

export default api;
