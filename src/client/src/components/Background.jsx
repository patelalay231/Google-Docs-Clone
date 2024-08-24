import React from 'react';

const Background = ({ children }) => {
    return (
        <div className="min-w-full relative min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
            <div className="relative w-full h-full flex justify-center items-center">
                {children}
            </div>
        </div>
    );
};

export default Background;
