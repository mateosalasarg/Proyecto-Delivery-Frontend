import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext'; // Importa el contexto
import './StylesAdmin/Dashboard.css'; // Importa el CSS

const Dashboard = () => {
    const { logout } = useContext(AuthContext); // Obtén la función de logout desde el contexto
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Llama a la función logout para eliminar la autenticación
        navigate('/admin/login'); // Redirige a la página de login
    };

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>
            <p>Bienvenido al panel de administración.</p>

            <div className="dashboard-buttons">
                {/* Botón para ver pedidos */}
                <Link to="/admin/pedidos">
                    <button>Ver Pedidos</button>
                </Link>
                {/* Enlace para ver los platos */}
                <Link to="/admin/platos">
                    <button>Ver platos</button>
                </Link>
                {/* Enlace para registrar Repartidor */}
                <Link to="/admin/repartidores">
                    <button>Gestionar repartidores</button>
                </Link>
            </div>

            {/* Botón de logout */}
            <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default Dashboard;
