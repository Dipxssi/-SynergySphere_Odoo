import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/TaskItem.css';

const TaskItem = ({ task }) => {
    return (
        <div className={`task-item ${task.status.toLowerCase().replace(' ', '-')}`}>
            <div className="task-item-info">
                <h4>{task.name}</h4>
                <p>Status: {task.status}</p>
            </div>
            <Link to={`/tasks/${task._id}`} className="btn-view">
                View Details
            </Link>
        </div>
    );
};

export default TaskItem;
