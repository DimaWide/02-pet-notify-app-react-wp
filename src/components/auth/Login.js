import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Alert, CircularProgress } from '@mui/material';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
    
        try {
            // Send request to get both access and refresh tokens
            const response = await axios.post('http://dev.wp-blog/wp-json/jwt-auth/v1/token', {
                username,
                password,
            });
    
            // Store access token and refresh token
            localStorage.setItem('authToken', response.data.token); // Access token
            localStorage.setItem('refreshToken', response.data.refresh_token); // Refresh token
    
            // After successful login, redirect to home or dashboard page
            navigate('/'); // Redirect to home or dashboard page after successful login
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error('Error during login', err);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <Container maxWidth="xs">
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}
            >
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Login
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, py: 1.5 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>

                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Don't have an account? <a href="/register">Register</a>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;
