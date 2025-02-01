import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Header, Segment, Message } from 'semantic-ui-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://dev.wp-blog/wp-json/wp/v2/users/register', {
                username,
                email,
                password,
            });

            // After successful registration, redirect to login or home page
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error('Error during registration', err);
        }
    };

    return (
        <Container className='cmp-register' text>
            <Segment padded="very">
                <Header as="h2" textAlign="center">
                    Create an Account
                </Header>

                {error && (
                    <Message negative>
                        <Message.Header>Error</Message.Header>
                        <p>{error}</p>
                    </Message>
                )}

                <Form onSubmit={handleRegister}>
                    <Form.Input
                        label="Username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <Form.Input
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Form.Input
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Form.Input
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" primary fluid>
                        Register
                    </Button>
                </Form>

                <Message>
                    Already have an account? <a href="/login">Login</a>
                </Message>
            </Segment>
        </Container>
    );
};

export default Register;
