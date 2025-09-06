import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTask, updateTask } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/TaskDetail.css';

const TaskDetail = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await getTask(id);
                setTask(response);
                setStatus(response.status);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch task details.');
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        try {
            await updateTask(id, { status: newStatus });
        } catch (err) {
            setError('Failed to update task status.');
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="task-detail-container">
            <h2>{task.name}</h2>
            <p>{task.description}</p>
            <div className="task-meta">
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="task-actions">
                <label htmlFor="status">Change Status:</label>
                <select id="status" value={status} onChange={handleStatusChange}>
                    <option value="To-Do">To-Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>
        </div>
    );
};

export default TaskDetail;
