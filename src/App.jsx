import React, { useContext } from 'react'; // Asegúrate de incluir useContext

import { Routes, Route, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider, AuthContext } from './auth/AuthContext';
import Nav from './components/Nav/Nav';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Login from './pages/Login/LoginCliente/Login';
import LoginPage from './pages/admin/LoginPage'; // Importamos LoginPage
import DashboardPage from './pages/Admin/DashboardPage';
import Pedidos from './pages/Admin/Pedidos'
import Platos from './pages/Admin/Platos'
import Repartidor from './pages/Admin/Repartidor'
import OrderStatus from './pages/Order/OrderStatus'

import OrderForm from './components/OrdenForm/OrderForm';
import DriverLogin from './pages/Login/LoginRepartidor/DriverLogin';
import DriverProfile from './pages/Repartidor/DriverProfile';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = React.useContext(AuthContext);

    if (!isAuthenticated) {
        return <div>Acceso no autorizado. Por favor, inicia sesión.</div>;
    }

    return children;
};
// Componente para proteger rutas
const ProtectedDriverRoute = ({ children }) => {
    const { isDriverAuthenticated } = React.useContext(AuthContext);

    if (!isDriverAuthenticated) {
        return <div>Acceso no autorizado. Por favor, inicia sesión como repartidor.</div>;
    }

    return children;
};
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // Valida que 'children' sea un nodo React
};
// Componente para proteger rutas
const ProtectedAdminRoute = ({ children }) => {
    const { isAdminAuthenticated } = React.useContext(AuthContext);

    if (!isAdminAuthenticated) {
        return <div>Acceso no autorizado. Por favor, inicia sesión como Administrador.</div>;
    }

    return children;
};
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // Valida que 'children' sea un nodo React
};


const App = () => {
    const location = useLocation(); // Obtener la ubicación actual

    return (
        <AuthProvider>
            <div className="App">
                {/* Renderizamos el Nav solo si no estamos en la página de login */}
                {location.pathname !== '/' && <Nav />} 
                <Routes>
                    {/* Ruta para el login de administrador */}
                    <Route path="/admin/login" element={<LoginPage />} />
                    <Route
                    path="/dashboard"
                    element={
                        <ProtectedAdminRoute>
                            <DashboardPage /> {/* Asegúrate de que este componente esté definido */}
                        </ProtectedAdminRoute>
                    }
                />
                    {/* Rutas protegidas para el usuario autenticado */}
                    <Route
                        path="/home"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/order"
                        element={
                            <ProtectedRoute>
                                <OrderForm/>
                            </ProtectedRoute>
                        }
                        />
                        <Route
                            path="/estado-pedido/"
                            element={
                                <ProtectedRoute>
                                    <OrderStatus    />
                                </ProtectedRoute>
                            }
                    />
                    <Route
                        path="/admin/pedidos"
                        element={
                            <ProtectedAdminRoute>
                                <Pedidos /> {/* Componente donde se muestran los pedidos */}
                            </ProtectedAdminRoute>
                        }
                    />
                    <Route
                        path="/admin/platos"
                        element={
                            <ProtectedAdminRoute>
                                <Platos /> {/* Componente donde se muestran los platos */}
                            </ProtectedAdminRoute>
                        }
                    />
                                 <Route
                        path="/admin/repartidores"
                        element={
                            <ProtectedAdminRoute>
                                <Repartidor /> {/* Componente donde se muestran los platos */}
                            </ProtectedAdminRoute>
                        }
                    />
        
                    <Route
                        path="/order"
                        element={
                            <ProtectedRoute>
                                <OrderForm /> {/* Componente donde se muestran los platos */}
                            </ProtectedRoute>
                        }
                    />
                                     <Route
    path="/repartidor/login"
    element={
            <DriverLogin /> 
    }
/>
                                     <Route
    path="/repartidor/:id"
    element={
        <ProtectedDriverRoute>
            <DriverProfile /> 
            </ProtectedDriverRoute>
    }
/>

                    {/* Ruta para el login general */}
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </AuthProvider>
    );
};

export default App;
