import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getProjects } from '../utils/api';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    // ✅ Initialize as empty array to prevent reduce errors
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                console.log('Projects API response:', response);
                
                // ✅ Handle different response structures safely
                if (response.success && Array.isArray(response.data)) {
                    // Backend returns { success: true, data: [...] }
                    setProjects(response.data);
                } else if (Array.isArray(response)) {
                    // Direct array response
                    setProjects(response);
                } else {
                    // Fallback to empty array
                    setProjects([]);
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to fetch projects.');
                setProjects([]); // ✅ Always set to empty array on error
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

    // ✅ Safe calculation - check if projects is array and handle missing tasks
    const totalTasks = Array.isArray(projects) 
        ? projects.reduce((acc, project) => {
            // Safe access to tasks array
            const taskCount = project.tasks && Array.isArray(project.tasks) 
                ? project.tasks.length 
                : 0;
            return acc + taskCount;
        }, 0)
        : 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                {/* ✅ Fixed user name - use firstName or full name */}
                <h2>Welcome, {user?.firstName || user?.name || 'User'}! 👋</h2>
                <Link to="/projects/new" className="btn btn-primary">
                    Create New Project
                </Link>
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
                {/* ✅ Additional stats for better dashboard */}
                <div className="summary-card">
                    <h3>Active Projects</h3>
                    <p>{projects.filter(p => p.status === 'active' || !p.status).length}</p>
                </div>
            </div>

            <h3>Your Projects</h3>
            <div className="project-list">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <ProjectCard 
                            key={project._id || project.id} 
                            project={project} 
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <p>You don't have any projects yet. Create one to get started! 🚀</p>
                        <Link to="/projects/new" className="btn btn-primary">
                            Create Your First Project
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
