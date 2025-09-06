import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getProjects } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const MyTasks = () => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyTasks = async () => {
            try {
                setLoading(true);
                
                // 1. Fetch all projects from API
                const response = await getProjects();
                let apiTasks = [];
                
                if (response.success && response.data && response.data.projects) {
                    const projects = response.data.projects;
                    
                    // Extract all tasks from all projects
                    projects.forEach(project => {
                        if (project.tasks && Array.isArray(project.tasks)) {
                            const projectTasks = project.tasks.map(task => ({
                                ...task,
                                projectId: project._id,
                                projectName: project.name
                            }));
                            apiTasks = [...apiTasks, ...projectTasks];
                        }
                    });
                }
                
                // 2. ALSO get tasks from localStorage (newly added tasks)
                const localTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
                console.log('📁 Local tasks found:', localTasks);
                
                // 3. Combine both API and local tasks
                const allTasks = [...apiTasks, ...localTasks];
                console.log('🔄 All tasks combined:', allTasks);
                
                // 4. Filter tasks for current user (case insensitive)
                const userEmail = user?.email?.toLowerCase();
                const userFirstName = user?.firstName?.toLowerCase();
                
                const userTasks = allTasks.filter(task => {
                    if (task.assignedTo) {
                        const assigned = task.assignedTo.toLowerCase();
                        return (
                            assigned === userEmail || 
                            assigned === userFirstName ||
                            assigned.includes(userFirstName) ||
                            assigned === 'unassigned' ||
                            assigned === 'me'
                        );
                    }
                    // If no assignedTo field, assume it belongs to current user
                    return true;
                });
                
                console.log('👤 Filtered user tasks:', userTasks);
                console.log('🔍 User email:', userEmail, 'firstName:', userFirstName);
                
                setTasks(userTasks);
                
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError('Failed to load tasks');
                
                // Fallback to demo tasks
                setTasks([
                    {
                        id: 'demo-1',
                        title: 'Complete SynergySphere Dashboard',
                        description: 'Finish the project management interface',
                        status: 'in-progress',
                        priority: 'high',
                        projectName: 'SynergySphere Demo',
                        assignedTo: user?.firstName || 'You'
                    },
                    {
                        id: 'demo-2', 
                        title: 'Test Authentication System',
                        description: 'Verify all login/logout functionality',
                        status: 'pending',
                        priority: 'medium',
                        projectName: 'SynergySphere Demo',
                        assignedTo: user?.firstName || 'You'
                    }
                ]);
                
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyTasks();
        }
    }, [user]);

    // Re-fetch when returning to this page
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && user) {
                fetchMyTasks();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [user]);

    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    const handleTaskStatusUpdate = (taskId, newStatus) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                (task.id === taskId || task._id === taskId)
                    ? { ...task, status: newStatus }
                    : task
            )
        );
        
        // Also update in localStorage if it exists there
        const localTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
        const updatedLocalTasks = localTasks.map(task => 
            (task.id === taskId || task._id === taskId)
                ? { ...task, status: newStatus }
                : task
        );
        localStorage.setItem('allTasks', JSON.stringify(updatedLocalTasks));
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="my-tasks-page">
            <div className="page-header">
                <h2>My Tasks</h2>
                <p>Tasks assigned to you across all projects</p>
            </div>

            {error && (
                <div className="error-banner">
                    <p>⚠️ {error} - Showing demo data</p>
                </div>
            )}

            <div className="tasks-stats">
                <div className="stat-card">
                    <h3>{tasks.length}</h3>
                    <p>Total Tasks</p>
                </div>
                <div className="stat-card">
                    <h3>{pendingTasks.length}</h3>
                    <p>Pending</p>
                </div>
                <div className="stat-card">
                    <h3>{inProgressTasks.length}</h3>
                    <p>In Progress</p>
                </div>
                <div className="stat-card">
                    <h3>{completedTasks.length}</h3>
                    <p>Completed</p>
                </div>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-tasks">
                    <h3>No tasks assigned yet! 📝</h3>
                    <p>Add tasks in your projects and they'll appear here when assigned to you.</p>
                </div>
            ) : (
                <div className="tasks-sections">
                    {/* In Progress Tasks */}
                    {inProgressTasks.length > 0 && (
                        <div className="tasks-section">
                            <h3>🚀 In Progress ({inProgressTasks.length})</h3>
                            <div className="tasks-grid">
                                {inProgressTasks.map(task => (
                                    <TaskCard 
                                        key={task.id || task._id} 
                                        task={task} 
                                        onStatusUpdate={handleTaskStatusUpdate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pending Tasks */}
                    {pendingTasks.length > 0 && (
                        <div className="tasks-section">
                            <h3>⏳ Pending ({pendingTasks.length})</h3>
                            <div className="tasks-grid">
                                {pendingTasks.map(task => (
                                    <TaskCard 
                                        key={task.id || task._id} 
                                        task={task} 
                                        onStatusUpdate={handleTaskStatusUpdate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completed Tasks */}
                    {completedTasks.length > 0 && (
                        <div className="tasks-section">
                            <h3>✅ Completed ({completedTasks.length})</h3>
                            <div className="tasks-grid">
                                {completedTasks.map(task => (
                                    <TaskCard 
                                        key={task.id || task._id} 
                                        task={task} 
                                        onStatusUpdate={handleTaskStatusUpdate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Enhanced TaskCard Component
const TaskCard = ({ task, onStatusUpdate }) => {
    return (
        <div className={`task-card ${task.status}`}>
            <div className="task-header">
                <h4>{task.title || task.name}</h4>
                <span className={`priority-badge ${task.priority || 'medium'}`}>
                    {task.priority || 'medium'}
                </span>
            </div>
            
            <p>{task.description || 'No description provided'}</p>
            
            <div className="task-meta">
                <span className="project-name">
                    📋 {task.projectName || 'Unknown Project'}
                </span>
                <span className="assigned-to">
                    👤 {task.assignedTo || 'Unassigned'}
                </span>
                {task.dueDate && (
                    <span className="due-date">📅 {task.dueDate}</span>
                )}
            </div>
            
            <div className="task-actions">
                <select
                    value={task.status || 'pending'}
                    onChange={(e) => onStatusUpdate(task.id || task._id, e.target.value)}
                    className={`status-select ${task.status || 'pending'}`}
                >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
        </div>
    );
};

export default MyTasks;
