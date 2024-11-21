import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Удаляем токены
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        // Перенаправляем на страницу входа
        navigate('/login');
    }, [navigate]);

    return null; // Ничего не рендерим
};

export default Logout;
