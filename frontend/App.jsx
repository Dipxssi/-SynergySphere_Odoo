import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './src/contexts/AuthContext';
import Layout from './src/components/Layout';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import Dashboard from './src/pages/Dashboard';
import ProjectDetail from './src/pages/ProjectDetail';
import TaskDetail from './src/pages/TaskDetail';
import Profile from './src/pages/Profile';
import CreateProject from './src/components/CreateProject';
import MyTasks from './src/pages/MyTasks';
import PrivateRoute from './src/components/PrivateRoute';
import './src/styles/App.css';
import './src/styles/Responsive.css';
import './src/styles/Layout.css';



const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    {/* ✅ CRITICAL: Routes must wrap ALL Route components */}
                    <Routes>
                        <Route path="/" element={<Login />} />
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
                            path="/my-tasks"
                            element={
                                <PrivateRoute>
                                    <MyTasks />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/projects/new"
                            element={
                                <PrivateRoute>
                                    <CreateProject />
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
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />

                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
};

export default App;
