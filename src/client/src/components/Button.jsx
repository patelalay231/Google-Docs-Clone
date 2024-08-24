import React from 'react';

const Button = ({ children, onClick, type = 'button' }) => {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
