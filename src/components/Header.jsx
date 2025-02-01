import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Button, Icon, Sidebar } from "semantic-ui-react";

const Header = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }

        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDarkMode = () => {
        document.body.classList.add('no-transition');

        setIsDarkMode((prev) => !prev);

        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 1);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <>
            <div className="cmp-header">
                <div className="data-container swd-container">
                    <Menu borderless size="large" className="cmp-header header ui top">
                        <Menu.Item header>
                            <Link to="/" className="logo">
                                <Icon name="book" /> Notesty
                            </Link>
                        </Menu.Item>

                        <Menu.Menu position="right" className="desktop-menu">
                            <Menu.Item as={Link} to="/" content="Home" />
                            {!authToken ? (
                                <>
                                    <Menu.Item as={Link} to="/login" content="Login" />
                                    <Menu.Item as={Link} to="/register" content="Register" />
                                </>
                            ) : (
                                <Dropdown item text="Profile">
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/profile">
                                            Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>
                                            Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}

                            <Menu.Item>
                                <Button
                                    icon
                                    toggle
                                    onClick={toggleDarkMode}
                                    className="data-theme-mode dark-mode-toggle"
                                    title="Toggle Dark Mode"
                                >
                                    <Icon name={isDarkMode ? "moon" : "sun"} />
                                </Button>
                            </Menu.Item>
                        </Menu.Menu>

                        <Menu.Item
                            position="right"
                            className="mobile-menu-button"
                            onClick={toggleMobileMenu}
                        >
                            <Icon name="bars" size="large" />
                        </Menu.Item>
                    </Menu>

                    <Sidebar
                        as={Menu}
                        animation="push"
                        icon="labeled"
                        inverted
                        onHide={() => setMobileMenuOpen(false)}
                        vertical
                        visible={isMobileMenuOpen}
                        width="thin"
                    >
                        <Menu.Item as={Link} to="/" content="Home" />
                        {!authToken ? (
                            <>
                                <Menu.Item as={Link} to="/login" content="Login" />
                                <Menu.Item as={Link} to="/register" content="Register" />
                            </>
                        ) : (
                            <Menu.Item>
                                <Button fluid color="blue" onClick={handleLogout}>
                                    <Icon name="sign-out" /> Logout
                                </Button>
                            </Menu.Item>
                        )}

                        <Menu.Item>
                            <Button
                                icon
                                toggle
                                onClick={toggleDarkMode}
                                className="dark-mode-toggle"
                                title="Toggle Dark Mode"
                            >
                                <Icon name={isDarkMode ? "moon" : "sun"} />
                            </Button>
                        </Menu.Item>
                    </Sidebar>
                </div>
            </div>
        </>
    );
};

export default Header;
