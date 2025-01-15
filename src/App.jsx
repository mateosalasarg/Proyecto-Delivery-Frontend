import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthProvider, AuthContext } from './auth/AuthContext';
import Nav from './components/Nav/Nav';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Order from './pages/Order/Order';
import Login from './pages/Login/Login';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/Admin/DashboardPage';
import Pedidos from './pages/Admin/Pedidos';
import Platos from './pages/Admin/Platos';

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = React.useContext(AuthContext);

    if (!isAuthenticated) {
        return <div>Acceso no autorizado. Por favor, inicia sesión.</div>;
    }

    return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

const App = () => {
    const location = useLocation();

    // Rutas donde no se muestra el Nav
    const hideNavRoutes = ["/", "/admin/login"];

    return (
        <AuthProvider>
            <div className="App">
                {/* Renderizar Nav solo si no estamos en rutas específicas */}
                {!hideNavRoutes.includes(location.pathname) && <Nav />}
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/admin/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
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
                                <Order />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/pedidos"
                        element={
                            <ProtectedRoute>
                                <Pedidos />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/platos"
                        element={
                            <ProtectedRoute>
                                <Platos />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </AuthProvider>
    );
};

export default App;
