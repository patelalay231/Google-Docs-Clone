import React from 'react';

const Form = ({ onSubmit, children }) => {
    return (
        <form onSubmit={onSubmit} className="w-full max-w-sm">
            {children}
        </form>
    );
};

export default Form;
