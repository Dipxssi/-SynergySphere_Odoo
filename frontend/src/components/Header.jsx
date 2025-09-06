import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">
                    SynergySphere
                </Link>
                <nav>
                    {user ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/profile">Profile</Link>
                            <button onClick={logout} className="btn-logout">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
