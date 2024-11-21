import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        <header className="bg-blue-600 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Логотип */}
                <div className="text-2xl font-bold">
                    <Link to="/">Логотип</Link>
                </div>

                {/* Навигация для десктопа */}
                <nav className="hidden md:flex space-x-6 items-center">
                    <Link to="/" className="hover:text-blue-300 transition duration-300">
                        Home
                    </Link>
                    {!authToken ? (
                        <>
                            <Link to="/login" className="hover:text-blue-300 transition duration-300">
                                Login
                            </Link>
                            <Link to="/register" className="hover:text-blue-300 transition duration-300">
                                Register
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="hover:text-blue-300 transition duration-300"
                        >
                            Logout
                        </button>
                    )}
                </nav>

                {/* Кнопка для мобильного меню */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-white focus:outline-none"
                        aria-label="Toggle navigation menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Мобильное меню */}
            {isMobileMenuOpen && (
                <nav className="md:hidden bg-blue-700 py-4">
                    <ul className="flex flex-col space-y-2 items-center">
                        <li>
                            <Link to="/" className="hover:text-blue-300 transition duration-300">
                                Home
                            </Link>
                        </li>
                        {!authToken ? (
                            <>
                                <li>
                                    <Link
                                        to="/login"
                                        className="hover:text-blue-300 transition duration-300"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/register"
                                        className="hover:text-blue-300 transition duration-300"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="hover:text-blue-300 transition duration-300"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            )}
        </header>
    );
};

export default Header;
