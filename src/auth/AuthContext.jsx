import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Crea el contexto para la autenticación
const AuthContext = createContext();

// Crea el proveedor de autenticación
const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState();  // Añadimos el estado del usuario
    const navigate = useNavigate();

    // Al cargar el componente, verificamos si el usuario está autenticado
    useEffect(() => {
        const storedAuth = localStorage.getItem('isAuthenticated');
        const storedUser = JSON.parse(localStorage.getItem('user'));  // Recupera los datos del cliente
        if (storedAuth === 'true' && storedUser) {
            setIsAuthenticated(true);
            setUser(storedUser);  // Asignamos los datos del cliente
        }
    }, []);  // Este useEffect solo se ejecuta al montar el componente

    // Función para iniciar sesión
    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);  // Guardamos los datos del cliente en el estado
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));  // Guardamos los datos del cliente en localStorage
        navigate('/home');
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null); // Elimina el usuario del estado
        localStorage.removeItem('isAuthenticated'); // Elimina el estado de autenticación
        localStorage.removeItem('user'); // Elimina los datos del cliente
        navigate('/'); // Redirige al inicio de sesión
    };
    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Valida la propiedad 'children' como un nodo React
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Exporta el contexto y el proveedor
export { AuthProvider, AuthContext };
