import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import '../styles/Discussion.css';

const Discussion = ({ discussions }) => {
    return (
        <div className="discussion-container">
            <h3>Discussions</h3>
            {discussions && discussions.map((discussion) => (
                <Card key={discussion._id} className="discussion-card">
                    <CardContent>
                        <Typography variant="subtitle1" component="div">
                            {discussion.author.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {discussion.text}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Discussion;
