import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getProjects } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const response = await getProjects();
            if (response.success && Array.isArray(response.data.projects)) {
                setProjects(response.data.projects);
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h2>Projects</h2>
                <p>Manage all your team projects</p>
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project._id} className="project-card">
                        <h3>{project.name}</h3>
                        <p>{project.description || 'No description'}</p>
                        
                        <div className="project-stats">
                            <div className="stat-item">
                                <span>📋</span> {project.tasks?.length || 0} tasks
                            </div>
                            <div className="stat-item">
                                <span>👥</span> {project.members?.length || 1} members
                            </div>
                        </div>
                        
                        <div className="project-meta">
                            <span className={`status-badge ${project.status || 'active'}`}>
                                {project.status || 'active'}
                            </span>
                            <Link to={`/projects/${project._id}`} className="view-btn">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="empty-state">
                    <h3>No projects yet</h3>
                    <p>Create your first project to get started</p>
                    <Link to="/projects/new" className="new-project-btn">
                        + Create Project
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
