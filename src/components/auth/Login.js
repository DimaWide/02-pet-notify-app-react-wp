import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, Container, Header, Message, Segment, Loader } from 'semantic-ui-react';

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
            const response = await axios.post('http://dev.wp-blog/wp-json/jwt-auth/v1/token', {
                username,
                password,
            });

            localStorage.setItem('authToken', response.data.token);

            navigate('/');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            console.error('Error during login', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className='cmp-login' text>
            <Segment padded="very">
                <Header as="h2" textAlign="center">
                    Login
                </Header>

                {error && (
                    <Message negative>
                        <Message.Header>Login Error</Message.Header>
                        <p>{error}</p>
                    </Message>
                )}

                <Form onSubmit={handleLogin}>
                    <Form.Input
                        label="Username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <Form.Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" primary fluid disabled={loading}>
                        {loading ? <Loader active inline size="small" /> : 'Login'}
                    </Button>
                </Form>

                <Message>
                    Don't have an account? <a href="/register">Register</a>
                </Message>
            </Segment>
        </Container>
    );
};

export default Login;
