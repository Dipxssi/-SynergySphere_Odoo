import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const AddTask = ({ projectId, onTaskAdded, onCancel }) => {
    const { user } = useContext(AuthContext);
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: user?.email || user?.firstName || ''  // Auto-assign to current user
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!taskData.title.trim()) {
            alert('Task title is required!');
            return;
        }

        setIsSubmitting(true);
        
        try {
            // Create new task with better structure
            const newTask = {
                id: Date.now(),
                projectId: projectId,
                title: taskData.title.trim(),
                description: taskData.description.trim(),
                status: taskData.status,
                priority: taskData.priority,
                assignedTo: taskData.assignedTo || user?.email || user?.firstName || 'Unassigned',
                createdAt: new Date().toISOString(),
                createdBy: user?.email || user?.firstName,
                dueDate: null // Can be added later
            };
            
            console.log('📝 New task created:', newTask);
            
            // Call parent function to add task
            if (onTaskAdded) {
                onTaskAdded(newTask);
            }
            
            // Reset form
            setTaskData({
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                assignedTo: user?.email || user?.firstName || ''
            });
            
            // Close modal
            if (onCancel) {
                onCancel();
            }
            
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setTaskData({
            ...taskData,
            [e.target.name]: e.target.value
        });
    };

    // Close modal when clicking outside
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className="add-task-modal" onClick={handleOverlayClick}>
            <div className="add-task-form">
                <div className="modal-header">
                    <h3>Add New Task</h3>
                    <button className="close-btn" onClick={onCancel}>×</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Task Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={taskData.title}
                            onChange={handleChange}
                            required
                            placeholder="Enter task title"
                            className={!taskData.title.trim() ? 'error' : ''}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={taskData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Task description (optional)"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                name="priority"
                                value={taskData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={taskData.status}
                                onChange={handleChange}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Assign To</label>
                        <input
                            type="text"
                            name="assignedTo"
                            value={taskData.assignedTo}
                            onChange={handleChange}
                            placeholder={`Default: ${user?.firstName || 'Current user'}`}
                        />
                        <small className="form-hint">
                            Leave blank to assign to yourself
                        </small>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="btn btn-secondary"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="btn btn-primary"
                            disabled={!taskData.title.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
