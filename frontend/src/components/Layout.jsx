import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Layout = ({ children }) => {
    const [darkMode, setDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initialize dark mode on component mount
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            if (newMode) {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
            }
            return newMode;
        });
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    const goToProfile = () => {
        navigate('/profile');
        setShowProfileMenu(false);
    };

    const goToMyTasks = () => {
        navigate('/my-tasks');
        setShowProfileMenu(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowProfileMenu(false);
    };

    // Don't show layout on auth pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return children;
    }

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>Company</h2>
                </div>

                <nav className="sidebar-nav">
                    <Link 
                        to="/dashboard" 
                        className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
                    >
                        Projects
                    </Link>
                    <Link 
                        to="/my-tasks" 
                        className={`nav-item ${location.pathname === '/my-tasks' ? 'active' : ''}`}
                    >
                         My Tasks
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <button className="theme-toggle" onClick={toggleDarkMode}>
                        {darkMode ? '☀️' : '🌙'}
                    </button>
                    
                    {/* ✅ CLICKABLE USER PROFILE WITH DROPDOWN */}
                    <div className="user-profile-container" ref={profileMenuRef}>
                        <div 
                            className="user-profile clickable"
                            onClick={toggleProfileMenu}
                            role="button"
                            tabIndex={0}
                            aria-haspopup="true"
                            aria-expanded={showProfileMenu}
                        >
                            <div className="user-avatar">
                                {user?.firstName?.charAt(0) || 'U'}
                            </div>
                            <div className="user-info">
                                <span className="user-name">{user?.firstName || 'User'}</span>
                                <div className="user-email">{user?.email}</div>
                            </div>
                        </div>

                        {/* ✅ DROPDOWN MENU */}
                        {showProfileMenu && (
                            <div className="profile-dropdown">
                                <div className="profile-header">
                                    <div className="large-avatar">
                                        {user?.firstName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="profile-details">
                                        <div className="profile-name">
                                            {user?.firstName} {user?.lastName || ''}
                                        </div>
                                        <div className="profile-email">{user?.email}</div>
                                        <div className="profile-role">Team Member</div>
                                    </div>
                                </div>
                                
                                <div className="profile-actions">
                                    <button className="profile-action-btn" onClick={goToProfile}>
                                        View Profile
                                    </button>
                                    <button className="profile-action-btn" onClick={goToMyTasks}>
                                         My Tasks
                                    </button>
                                    <button className="profile-action-btn">
                                         Settings
                                    </button>
                                    <div className="menu-divider"></div>
                                    <button className="profile-action-btn logout" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Top Header */}
                <div className="top-header">
                    <div className="header-left">
                        <h1>SynergySphere</h1>
                    </div>
                    
                    <div className="header-center">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search......"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <span className="search-icon"></span>
                        </div>
                    </div>

                    <div className="header-right">
                        <div className="header-actions">
                            <button className="action-btn">•••</button>
                            <Link to="/projects/new" className="new-project-btn">
                                + New Project
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
