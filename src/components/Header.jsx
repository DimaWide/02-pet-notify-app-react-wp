import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Container, Dropdown, Button, Icon } from 'semantic-ui-react';

const Header = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken'); // Проверка наличия токена
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Удаляем токен
        navigate('/login'); // Перенаправляем на страницу входа
    };

    return (
        <Menu borderless size="large" className="header  ui fixed top">
            <Container>
                {/* Логотип */}
                <Menu.Item header>
                    <Link to="/" className="logo">
                        <Icon name="home" /> MyApp
                    </Link>
                </Menu.Item>

                {/* Навигация для десктопа */}
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
                                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    )}
                </Menu.Menu>

                {/* Мобильная кнопка */}
                <Menu.Item
                    position="right"
                    className="mobile-menu-button"
                    onClick={toggleMobileMenu}
                >
                    <Icon name="bars" size="large" />
                </Menu.Item>
            </Container>

            {/* Мобильное меню */}
            {isMobileMenuOpen && (
                <Menu vertical fluid className="mobile-menu">
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
                </Menu>
            )}
        </Menu>
    );
};

export default Header;
