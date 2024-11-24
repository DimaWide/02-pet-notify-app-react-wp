import React, { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const [isValidToken, setIsValidToken] = useState(null);
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        if (authToken) {

            setIsValidToken(true); // Token is valid
            return;
            // Make a POST request to validate the token using WordPress JWT plugin
            fetch('http://dev.wp-blog/wp-json/jwt-auth/v1/token/validate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    // Check if the token is valid
                    if (data.code === 'jwt_auth_valid_token' && data.data.status === 200) {
                        setIsValidToken(true); // Token is valid
                    } else {
                        setIsValidToken(false); // Token is invalid or expired
                    }
                })
                .catch(() => {
                    setIsValidToken(false); // If there's an error, treat it as invalid token
                });
        } else {
            setIsValidToken(false); // If no token is found, treat as invalid
        }
    }, [authToken]);

    if (isValidToken === null) {
        // Display a semantic loader while validating the token
        // <Loader active inline="centered" />;
        return;
    }

    if (!isValidToken) {
        // Redirect to login if token is invalid or expired
        return <Navigate to="/login" />;
    }

    // If token is valid, render the protected route
    return children;
};

export default PrivateRoute;
