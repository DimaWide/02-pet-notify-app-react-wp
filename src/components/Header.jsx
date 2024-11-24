import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Button, Icon, Sidebar } from "semantic-ui-react";

const Header = () => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken"); // Проверка наличия токена
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    ); // Проверка сохраненной темы

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
        // Отключаем переходы для всей страницы
        document.body.classList.add('no-transition');

        // Переключаем тему
        setIsDarkMode((prev) => !prev);

        // Включаем переходы обратно через 300ms (время длительности анимации)
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 1); // Убедитесь, что время задержки соответствует длительности анимации
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken"); // Удаляем токен
        navigate("/login"); // Перенаправляем на страницу входа
    };

    return (
        <>
            <div className="cmp-header">
                <div className="data-container swd-container">
                    <Menu borderless size="large" className="cmp-header header ui top">
                        {/* Логотип */}
                        <Menu.Item header>
                            <Link to="/" className="logo">
                                <Icon name="book" /> Notesty
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
                                        <Dropdown.Item as={Link} to="/profile">
                                            Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={handleLogout}>
                                            Logout
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}

                            {/* Кнопка переключения темного режима в десктопном меню */}
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

                        {/* Мобильная кнопка */}
                        <Menu.Item
                            position="right"
                            className="mobile-menu-button"
                            onClick={toggleMobileMenu}
                        >
                            <Icon name="bars" size="large" />
                        </Menu.Item>
                    </Menu>

                    {/* Мобильное меню */}
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

                        {/* Кнопка переключения темного режима в мобильном меню */}
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
