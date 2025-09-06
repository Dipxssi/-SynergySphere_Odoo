import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../utils/api';

const CreateProject = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        priority: 'medium',
        startDate: '',
        endDate: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            console.log('Creating project with data:', formData);
            const response = await createProject(formData);
            console.log('Project created successfully:', response);
            
            // ✅ Navigate with replace to force dashboard refresh
            navigate('/dashboard', { replace: true });
            
            // ✅ Force page reload as backup (remove after testing)
            window.location.reload();
            
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="create-project-container">
            <h2>Create New Project</h2>
            <form onSubmit={handleSubmit} className="project-form">
                <div className="form-group">
                    <label>Project Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter project name"
                    />
                </div>
                
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Project description (optional)"
                    />
                </div>
                
                <div className="form-group">
                    <label>Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                    />
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading || !formData.name.trim()}
                        className="btn btn-primary"
                    >
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProject;
