import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    Header,
    Grid,
    Segment,
    Icon,
    Loader,
    Message,
    List,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(
                    "http://dev.wp-blog/wp-json/wp/v2/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUser(response.data);
            } catch (err) {
                setError("Failed to load user profile");
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return (
            <Container>
                <Message negative>
                    <Message.Header>Error Loading Profile</Message.Header>
                    <p>{error}</p>
                </Message>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container>
                <Loader active inline="centered" size="large">
                    Loading Profile...
                </Loader>
            </Container>
        );
    }

    return (
        <div className="cmp-profile">
            <div className="data-container">
                <div className="swd-cntainer">
                    <Container>
                        <Header as="h1" textAlign="center" color="blue">
                            Profile: {user.name}
                            <Header.Subheader>
                                Here’s your account information.
                            </Header.Subheader>
                        </Header>

                        <Segment padded>
                            <Grid stackable>
                                <Grid.Row>
                                    <Grid.Column width={20}>
                                        <Segment raised textAlign="center">

                                            <Header as="h4" dividing>
                                                Account Details
                                            </Header>
                                            <List divided relaxed>
                                            <List.Item>
                                            <Icon name="user circle" size="" />
                                                    <List.Content>
                                                        <List.Header>Username</List.Header>
                                                        {user.name}
                                                    </List.Content>
                                                </List.Item>

                                                <List.Item>
                                                    <Icon name="mail" />
                                                    <List.Content>
                                                        <List.Header>Email</List.Header>
                                                        {user.email}
                                                    </List.Content>
                                                </List.Item>
                                                <List.Item>
                                                    <Icon name="calendar" />
                                                    <List.Content>
                                                        <List.Header>Registered On</List.Header>
                                                        {new Date(user.registered_date).toLocaleDateString()}
                                                    </List.Content>
                                                </List.Item>
                                            </List>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Segment>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
