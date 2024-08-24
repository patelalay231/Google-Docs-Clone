import React, { useState } from 'react';
import { AuthCard, Form, Input, Button, Background, Notification } from '../components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
require('dotenv').config();
const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [notification, setNotification] = useState({ message: '', type: '' });

    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.BACKEND_SERVER_URI}/api/user/register`, formData);
            setFormData({
                username: '',
                email: '',
                password: ''
            });
            setNotification({
                message: 'Sign-up successful! You can now log in.',
                type: 'success'
            });
            navigate('/login'); // Redirect after 2 seconds
        } catch (error) {
            let errorMessage = 'An error occurred during sign-up. Please try again.';

            if (error.response) {
                // Server responded with an error status code
                errorMessage = error.response.data.error || 'Sign-up failed. Please check the details and try again.';
            } else if (error.request) {
                // Request was made but no response was received
                errorMessage = 'No response from server. Please check your internet connection.';
            } else {
                // Something else triggered an error
                errorMessage = error.message;
            }

            setNotification({
                message: errorMessage,
                type: 'error'
            });
        }
    };

    return (
        <Background>
            <AuthCard title="Sign Up">
                {notification.message && (
                    <Notification message={notification.message} type={notification.type} />
                )}
                <Form onSubmit={handleSubmit}>
                    <Input
                        label="Username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="flex items-center justify-center mt-6">
                        <Button type="submit">Sign Up</Button>
                    </div>
                    <p className="mt-4 text-center text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-500 hover:underline"
                        >
                            Log in
                        </button>
                    </p>
                </Form>
            </AuthCard>
        </Background>
    );
};

export default Signup;
