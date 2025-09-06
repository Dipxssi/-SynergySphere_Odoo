import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
    // ✅ SAFE way to handle potentially undefined tasks
    const tasks = project.tasks && Array.isArray(project.tasks) ? project.tasks : [];
    
    // Now you can safely use filter, map, etc.
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const totalTasks = tasks.length;
    
    return (
        <div className="project-card">
            <h3>{project.name || 'Untitled Project'}</h3>
            <p>{project.description || 'No description'}</p>
            
            <div className="project-stats">
                <span>Tasks: {totalTasks}</span>
                <span>Completed: {completedTasks.length}</span>
            </div>
            
            <div className="project-meta">
                <span className={`status ${project.status || 'active'}`}>
                    {project.status || 'active'}
                </span>
                <span className={`priority ${project.priority || 'medium'}`}>
                    {project.priority || 'medium'} priority
                </span>
            </div>
            
            <div className="project-actions">
                <Link 
                    to={`/projects/${project._id}`} 
                    className="btn btn-outline"
                >
                    View Project
                </Link>
            </div>
        </div>
    );
};

export default ProjectCard;
