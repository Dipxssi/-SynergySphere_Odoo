import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProjectCard.css';

const ProjectCard = ({ project }) => {
    const completedTasks = project.tasks.filter(task => task.status === 'Done').length;
    const progress = (completedTasks / project.tasks.length) * 100;

    return (
        <div className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="progress-bar">
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <Link to={`/projects/${project._id}`} className="btn">
                View Project
            </Link>
        </div>
    );
};

export default ProjectCard;
