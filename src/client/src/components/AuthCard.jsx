import React from 'react';

const AuthCard = ({ title, children }) => {
    return (
        <div className="w-full max-w-xs m-auto bg-white rounded-lg border border-gray-200 shadow-md p-5">
        <h2 className="text-center text-2xl font-bold mb-4">{title}</h2>
        {children}
        </div>
    );
};

export default AuthCard;
