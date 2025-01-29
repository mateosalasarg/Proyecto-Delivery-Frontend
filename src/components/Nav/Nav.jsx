import React, { useContext, useState } from 'react';
import './Nav.css';
import { assets } from '../../assets/assets';
import { AuthContext } from '../../auth/AuthContext';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const { carrito } = useContext(CartContext);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir a otra página

    // Calcular la cantidad total de platos en el carrito
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    // Alternar visibilidad del menú del carrito
    const toggleCartMenu = () => {
        setIsCartOpen(!isCartOpen);
    };

    // Redirigir al formulario de pedido con los datos del carrito
    const handleOrder = () => {
        console.log("Carrito al ordenar:", carrito);

        if (carrito.length === 0) {
            alert("El carrito está vacío. Agrega platos antes de ordenar.");
            return;
        }
        navigate('/order', { state: { carrito } });
    };

    return (
        <>
            <nav className="nav">
                <img src={assets.logo} alt="Logo" className="logo" />
                <ul className="nav-links">
                    <li>Inicio</li>
                    <li>Mis pedidos</li>
                    <li>Contáctanos</li>
                </ul>
                <div className="nav-right">
                    <img src={assets.search_icon} alt="Buscar" className="icon" />
                    <div className="nav-search-icon" onClick={toggleCartMenu}>
                        <img src={assets.bowl_icon} alt="Bowl" className="icon" />
                        {totalItems > 0 && (
                            <div className="cart-count">
                                {totalItems}
                            </div>
                        )}
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

            {/* Menú lateral del carrito */}
            {isCartOpen && (
                <div className="cart-menu">
                    <button className="close-cart" onClick={toggleCartMenu}>X</button>
                    <h2>Tu carrito</h2>
                    {carrito.length > 0 ? (
                        <>
                            <ul>
                                {carrito.map((item, index) => (
                                    <li key={index} className="cart-item">
                                        <span>{item.nombre}</span>
                                        <span>{item.cantidad} x ${item.precio}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="order-button" onClick={handleOrder}>
                                Ordenar
                            </button>
                        </>
                    ) : (
                        <p>El carrito está vacío.</p>
                    )}
                </div>
            )}
        </>
    );
};

export default Nav;
