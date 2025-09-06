import React from 'react';
import '../styles/MemberItem.css';

const MemberItem = ({ member }) => {
    return (
        <div className="member-item">
            <p>{member.name}</p>
        </div>
    );
};

export default MemberItem;
