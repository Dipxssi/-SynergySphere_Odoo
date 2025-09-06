import React from 'react';
import '../styles/Notifications.css';

const Notifications = ({ notifications }) => {
    return (
        <div className="notifications-container">
            {notifications.map((notification) => (
                <div key={notification._id} className="notification">
                    <p>{notification.message}</p>
                </div>
            ))}
        </div>
    );
};

export default Notifications;
