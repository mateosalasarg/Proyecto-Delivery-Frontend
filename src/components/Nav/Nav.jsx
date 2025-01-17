import React, { useContext } from 'react';
import './Nav.css';
import { assets } from '../../assets/assets';
import { AuthContext } from '../../auth/AuthContext';

const Nav = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    return (
        <nav className="nav">
            <img src={assets.logo} alt="Logo" className="logo" />
            <ul className="nav-links">
                <li>Inicio</li>
                <li>Menú</li>
                <li>Contáctanos</li>
            </ul>
            <div className="nav-right">
                <img src={assets.search_icon} alt="Buscar" className="icon" />
                <div className="nav-search-icon">
                    <img src={assets.bowl_icon} alt="Bowl" className="icon" />
                    <div className="dot"></div>
                </div>
                {isAuthenticated ? (
                    <div className="user-section">
                        <span>Hola, {user?.nombre}</span>
                        <button className="nav-button" onClick={logout}>
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <button className="nav-button">Iniciar sesión</button>
                )}
            </div>
        </nav>
    );
};

export default Nav;
