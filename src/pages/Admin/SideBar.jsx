// src/pages/admin/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Para crear enlaces de navegación

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Panel de Administración</h2>
      <nav>
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/orders">Pedidos</Link></li>
          <li><Link to="/admin/products">Productos</Link></li>
          <li><Link to="/admin/customers">Clientes</Link></li>
          <li><Link to="/admin/settings">Configuraciones</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
