import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EmailVerification = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('Verifying your email...');
    const [error, setError] = useState(null);
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (!token) {
                    setError('Verification token is missing. Please check your verification link.');
                    setIsLoading(false);
                    return;
                }

                const response = await axios.get(`/api/auth/verify-email/${token}`);
                
                
                if (response.data.verified) {
                    setStatus('Email verified successfully! Redirecting to login...');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setError('Email verification failed. Please try again.');
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 
                    (error.response?.status === 404 ? 'Invalid verification token' :
                    error.response?.status === 400 ? 'Invalid request' :
                    'Server error. Please try again later');
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 text-center">
                    {isLoading ? (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            {error}
                        </div>
                    ) : (
                        <div className="alert alert-success">
                            <i className="fas fa-check-circle me-2"></i>
                            {status}
                        </div>
                    )}
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/login')}
                        disabled={isLoading}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;

