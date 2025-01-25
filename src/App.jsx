import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider, AuthContext } from './auth/AuthContext';
import Nav from './components/Nav/Nav';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Order from './pages/Order/Order';
import Login from './pages/Login/LoginCliente/Login';
import LoginPage from './pages/admin/LoginPage'; // Importamos LoginPage
import DashboardPage from './pages/Admin/DashboardPage';
import Pedidos from './pages/Admin/Pedidos'
import Platos from './pages/Admin/Platos'
import OrderForm from './components/OrdenForm/OrderForm';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = React.useContext(AuthContext);

    if (!isAuthenticated) {
        return <div>Acceso no autorizado. Por favor, inicia sesión.</div>;
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
                        <ProtectedRoute>
                            <DashboardPage /> {/* Asegúrate de que este componente esté definido */}
                        </ProtectedRoute>
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
                        path="/admin/pedidos"
                        element={
                            <ProtectedRoute>
                                <Pedidos /> {/* Componente donde se muestran los pedidos */}
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/platos"
                        element={
                            <ProtectedRoute>
                                <Platos /> {/* Componente donde se muestran los platos */}
                            </ProtectedRoute>
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
                    {/* Ruta para el login general */}
                    <Route path="/" element={<Login />} />
                </Routes>
            </div>
        </AuthProvider>
    );
};

export default App;
