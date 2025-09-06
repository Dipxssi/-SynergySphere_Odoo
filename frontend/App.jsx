import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import Header from './src/components/Header';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Dashboard from './src/pages/Dashboard';
import ProjectDetail from './src/pages/ProjectDetail';
import TaskDetail from './src/pages/TaskDetail';
import Profile from './src/pages/Profile';
import PrivateRoute from './src/components/PrivateRoute';
import Notifications from './src/components/Notifications';
import './src/styles/App.css';
import './src/styles/Responsive.css';

const App = () => {
    const [notifications, setNotifications] = React.useState([]);

    return (
        <AuthProvider>
            <Router>
                <Header />
                <Notifications notifications={notifications} />
                <main className="container">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects/:id"
                            element={
                                <PrivateRoute>
                                    <ProjectDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/tasks/:id"
                            element={
                                <PrivateRoute>
                                    <TaskDetail />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </main>
            </Router>
        </AuthProvider>
    );
};

export default App;
