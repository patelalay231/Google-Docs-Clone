// components/Notification.js
import React from 'react';

const Notification = ({ message, type }) => {
    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        message && (
            <div className={`p-4 mb-4 rounded ${getTypeStyles()}`}>
                {message}
            </div>
        )
    );
};

export default Notification;
