import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../utils/api';
import TaskItem from '../components/TaskItem';
import MemberItem from '../components/MemberItem';
import Discussion from '../components/Discussion';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/ProjectDetail.css';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProject(id);
                setProject(response);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch project details.');
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="project-detail-container">
            <div className="project-detail-header">
                <h2>{project.name}</h2>
                <Link to={`/projects/${id}/tasks/new`} className="btn">
                    Create Task
                </Link>
            </div>
            <p>{project.description}</p>
            <div className="task-list">
                <h3>Tasks</h3>
                {project.tasks.map((task) => (
                    <TaskItem key={task._id} task={task} />
                ))}
            </div>
            <div className="member-list">
                <h3>Team Members</h3>
                {project.members.map((member) => (
                    <MemberItem key={member._id} member={member} />
                ))}
            </div>
            <Discussion discussions={project.discussions} />
        </div>
    );
};

export default ProjectDetail;
