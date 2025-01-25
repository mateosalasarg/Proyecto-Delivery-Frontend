import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Crea el contexto para la autenticación tanto del cliente como del repartidor
const AuthContext = createContext();

// Crea el proveedor de autenticación
const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(); // Estado para el cliente
    const [isDriverAuthenticated, setIsDriverAuthenticated] = useState(false); // Estado para el repartidor
    const [driver, setDriver] = useState(); // Estado para el repartidor
    const navigate = useNavigate();

    useEffect(() => {
        // Verificamos si hay datos guardados tanto para el cliente como para el repartidor
        const storedUserAuth = localStorage.getItem('isAuthenticated');
        const storedDriverAuth = localStorage.getItem('isDriverAuthenticated');

        // Intentamos obtener los datos del cliente de localStorage de forma segura
        let storedUser = null;
        try {
            storedUser = JSON.parse(localStorage.getItem('user'));
        } catch (error) {
            console.error("Error al intentar parsear los datos del usuario:", error);
        }

        // Intentamos obtener los datos del repartidor de localStorage de forma segura
        let storedDriver = null;
        try {
            storedDriver = JSON.parse(localStorage.getItem('driver'));
        } catch (error) {
            console.error("Error al intentar parsear los datos del repartidor:", error);
        }

        if (storedUserAuth === 'true' && storedUser) {
            setIsAuthenticated(true);
            setUser(storedUser);
        }

        if (storedDriverAuth === 'true' && storedDriver) {
            setIsDriverAuthenticated(true);
            setDriver(storedDriver);
        }
    }, []);

    const loginClient = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/home');
    };

    const loginDriver = (driverData) => {
        setIsDriverAuthenticated(true);
        setDriver(driverData);
        localStorage.setItem('isDriverAuthenticated', 'true');
        localStorage.setItem('driver', JSON.stringify(driverData));
        navigate('/repartidor');
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setIsDriverAuthenticated(false);
        setDriver(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('isDriverAuthenticated');
        localStorage.removeItem('driver');
        navigate('/'); // Redirige a la página de login
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated, 
            user, 
            isDriverAuthenticated, 
            driver, 
            loginClient, 
            loginDriver, 
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProvider, AuthContext };
