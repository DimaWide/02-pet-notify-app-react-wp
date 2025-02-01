import React, { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const [isValidToken, setIsValidToken] = useState(null);
    const authToken = localStorage.getItem('authToken');

    useEffect(() => {
        if (authToken) {

            fetch('http://dev.wp-blog/wp-json/jwt-auth/v1/token/validate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    if (data.code === 'jwt_auth_valid_token' && data.data.status === 200) {
                        setIsValidToken(true); 
                    } else {
                        setIsValidToken(false);
                    }
                })
                .catch(() => {
                    setIsValidToken(false); 
                });
        } else {
            setIsValidToken(false); 
        }
    }, [authToken]);

    if (isValidToken === null) {
        return;
    }

    if (!isValidToken) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateRoute;
