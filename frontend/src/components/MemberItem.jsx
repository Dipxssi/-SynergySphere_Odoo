import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import '../styles/MemberItem.css';

const MemberItem = ({ member }) => {
    return (
        <Card className="member-card">
            <CardContent>
                <Typography variant="body1">{member.name}</Typography>
            </CardContent>
        </Card>
    );
};

export default MemberItem;
