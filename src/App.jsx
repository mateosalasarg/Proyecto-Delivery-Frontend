import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './auth/AuthContext'; // Importa AuthProvider y AuthContext
import { useContext } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';

// Componente de protección para rutas privadas
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(AuthContext); // Obtén el estado de autenticación

    if (!isAuthenticated) {
        return <Navigate to="/" />;  // Redirige al login si no está autenticado
    }

    return children;  // Si está autenticado, muestra el contenido protegido
}

// Agregar validación para 'children' en las props del componente
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // Valida que 'children' sea un nodo React
};

function App() {
    return (
        <AuthProvider>  {/* Envuelve toda la app con AuthProvider */}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                    path="/home" 
                    element={
                        <ProtectedRoute>
                            <Home />  {/* Solo se renderiza si está autenticado */}
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
