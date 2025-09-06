import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
            });
            setLoading(false);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
        // Clear messages when user starts typing
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            // Simulate API call (replace with actual API when available)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For now, just show success message
            setSuccess('Profile updated successfully! (Note: This is a demo - changes are not persisted)');
            
        } catch (err) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-page">
            <div className="page-header">
                <h2>My Profile</h2>
                <p>Manage your account settings and preferences</p>
            </div>

            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-avatar-large">
                        {user?.firstName?.charAt(0) || 'U'}
                    </div>
                    
                    <div className="profile-info">
                        <h3>{user?.firstName} {user?.lastName || ''}</h3>
                        <p className="profile-email">{user?.email}</p>
                        <span className="profile-badge">Team Member</span>
                    </div>
                </div>

                <div className="profile-form-section">
                    <div className="form-container">
                        <h3>Edit Profile</h3>
                        
                        {error && (
                            <div className="message error-message">
                                ❌ {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="message success-message">
                                ✅ {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your first name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter your last name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setFormData({
                                            firstName: user?.firstName || '',
                                            lastName: user?.lastName || '',
                                            email: user?.email || '',
                                        });
                                        setError('');
                                        setSuccess('');
                                    }}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="profile-stats">
                        <h4>Account Stats</h4>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-number">0</span>
                                <span className="stat-label">Projects Created</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">0</span>
                                <span className="stat-label">Tasks Completed</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">1</span>
                                <span className="stat-label">Days Active</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">100%</span>
                                <span className="stat-label">Profile Complete</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
