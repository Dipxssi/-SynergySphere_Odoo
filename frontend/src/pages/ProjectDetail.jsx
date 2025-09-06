import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AddTask from '../components/AddTask';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddTask, setShowAddTask] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await getProject(id);
                console.log('Project detail response:', response);
                
                if (response.success && response.data) {
                    setProject(response.data);
                    setTasks(response.data.tasks || []);
                } else {
                    setError('Project not found');
                }
            } catch (err) {
                console.error('Error fetching project:', err);
                setError('Failed to load project');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);


const handleTaskAdded = async (newTask) => {
    try {
        setTasks([...tasks, newTask]);
        
        const existingTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
        const updatedTasks = [...existingTasks, newTask];
        localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
        
        console.log('Task added and saved:', newTask);
        console.log('All tasks in storage:', updatedTasks);
        
        setShowAddTask(false);
    } catch (error) {
        console.error(' Error saving task:', error);
        alert('Failed to save task');
    }
};


    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleTaskStatusChange = (taskId, newStatus) => {
        setTasks(tasks.map(task => 
            task.id === taskId 
                ? { ...task, status: newStatus }
                : task
        ));
    };

    if (loading) return <LoadingSpinner />;
    if (error || !project) {
        return (
            <div className="error-container">
                <h2>Project Not Found</h2>
                <p>{error || 'The requested project could not be found.'}</p>
                <Link to="/dashboard" className="btn btn-primary">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const completedTasks = tasks.filter(task => task.status === 'completed');
    const pendingTasks = tasks.filter(task => task.status !== 'completed');

    return (
        <div className="project-detail">
            <div className="project-header">
                <div>
                    <h1>{project.name || 'Untitled Project'}</h1>
                    <p>{project.description || 'No description provided'}</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn btn-primary"
                        onClick={() => setShowAddTask(true)}
                    >
                        + Add Task
                    </button>
                    <Link to="/dashboard" className="btn btn-secondary">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="project-stats">
                <div className="stat-card">
                    <h3>{tasks.length}</h3>
                    <p>Total Tasks</p>
                </div>
                <div className="stat-card">
                    <h3>{completedTasks.length}</h3>
                    <p>Completed</p>
                </div>
                <div className="stat-card">
                    <h3>{pendingTasks.length}</h3>
                    <p>Pending</p>
                </div>
            </div>

            <div className="tasks-section">
                <h2>Tasks</h2>
                {tasks.length > 0 ? (
                    <div className="tasks-list">
                        {tasks.map((task) => (
                            <div key={task.id} className="task-card">
                                <div className="task-header">
                                    <h3>{task.title}</h3>
                                    <div className="task-actions">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                                            className={`status-select ${task.status}`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <button 
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                
                                <p>{task.description || 'No description'}</p>
                                
                                <div className="task-meta">
                                    <span className={`priority ${task.priority}`}>
                                        {task.priority} priority
                                    </span>
                                    {task.assignedTo && (
                                        <span className="assigned-to">
                                            Assigned to: {task.assignedTo}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-tasks">
                        <p>No tasks yet. Create your first task to get started!</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowAddTask(true)}
                        >
                            + Add First Task
                        </button>
                    </div>
                )}
            </div>

            {showAddTask && (
                <AddTask
                    projectId={id}
                    onTaskAdded={handleTaskAdded}
                    onCancel={() => setShowAddTask(false)}
                />
            )}
        </div>
    );
};

export default ProjectDetail;
