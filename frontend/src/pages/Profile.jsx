import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../utils/api';
import { Card, CardContent, Typography, TextField, Button, CircularProgress } from '@mui/material';
import '../styles/Profile.css';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getUserProfile();
                setFormData({
                    name: profile.name,
                    email: profile.email,
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch profile.');
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(formData);
            setSuccess('Profile updated successfully.');
        } catch (err) {
            setError('Failed to update profile.');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div className="profile-container">
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Profile
                    </Typography>
                    {error && <Typography color="error">{error}</Typography>}
                    {success && <Typography color="primary">{success}</Typography>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Update Profile
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
