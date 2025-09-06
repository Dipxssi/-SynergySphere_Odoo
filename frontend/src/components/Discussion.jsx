import React from 'react';
import '../styles/Discussion.css';

const Discussion = ({ discussions }) => {
    return (
        <div className="discussion-container">
            <h3>Discussions</h3>
            {discussions && discussions.map((discussion) => (
                <div key={discussion._id} className="discussion-post">
                    <p><strong>{discussion.author.name}</strong></p>
                    <p>{discussion.text}</p>
                </div>
            ))}
        </div>
    );
};

export default Discussion;
