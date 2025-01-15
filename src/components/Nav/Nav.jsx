import React, { useContext } from 'react';
import './Nav.css';
import { assets } from '../../assets/assets';
import { AuthContext } from '../../auth/AuthContext'; // Importa el contexto de autenticación

const Nav = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext); // Accede al contexto de autenticación

    return (
        <div className="nav">
            <img src={assets.logo} alt="Logo" className="logo" />
            <ul className="nav-links">
                <li>Inicio</li>
                <li>Menú</li>
                <li>Contáctanos</li>
            </ul>
            <div className="nav-right">
                <img src={assets.search_icon} alt="Buscar" />
                <div className="nav-search-icon">
                    <img src={assets.bowl_icon} alt="Bowl" />
                    <div className="dot"></div>
                </div>
                {isAuthenticated ? (
                    <>
                        <span>Hola, {user?.nombre}</span>
                        <button onClick={logout}>Cerrar sesión</button>
                    </>
                ) : (
                    <button>Iniciar sesión</button>
                )}
            </div>
        </div>
    );
};

export default Nav;
