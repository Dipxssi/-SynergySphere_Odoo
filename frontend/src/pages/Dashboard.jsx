import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects } from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';

const Dashboard = () => {
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

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Dashboard</h2>
                <Link to="/projects/new" className="btn">Create Project</Link>
            </div>
            <div className="project-list">
                {projects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
