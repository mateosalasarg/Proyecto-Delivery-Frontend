// src/pages/Admin/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Bienvenido al panel de administración.</p>

            {/* Botón para ver pedidos */}
            <Link to="/admin/pedidos">
                <button>Ver Pedidos</button>
            </Link>
            {/* Enlace para ver los platos */}

            <Link to="/admin/platos">
                <button>Ver platos</button>
            </Link>
        </div>
    );
};

export default Dashboard;