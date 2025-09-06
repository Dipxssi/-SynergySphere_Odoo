import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getProjects } from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                setProjects(response);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch projects.');
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    const totalTasks = projects.reduce((acc, project) => acc + project.tasks.length, 0);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Welcome, {user?.name}!</h2>
                <Link to="/projects/new" className="btn btn-primary">Create New Project</Link>
            </div>

            <div className="dashboard-summary">
                <div className="summary-card">
                    <h3>Total Projects</h3>
                    <p>{projects.length}</p>
                </div>
                <div className="summary-card">
                    <h3>Total Tasks</h3>
                    <p>{totalTasks}</p>
                </div>
            </div>

            <h3>Your Projects</h3>
            <div className="project-list">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectCard key={project._id} project={project} />
                    ))
                ) : (
                    <p>You don't have any projects yet. Create one to get started!</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
