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
        let storedUser = null;
        const storedDriverAuth = localStorage.getItem('isDriverAuthenticated');

        let storedDriver = null;
        // Verifica si el valor en localStorage está disponible antes de intentar parsearlo
        const storedDriverData = localStorage.getItem('driver');
        if (storedDriverData) {
          try {
            storedDriver = JSON.parse(storedDriverData);
          } catch (error) {
            console.error("Error al intentar parsear los datos del repartidor:", error);
          }
        }

        // Intentamos obtener los datos del cliente de localStorage de forma segura
     

        try {
            storedUser = JSON.parse(localStorage.getItem('user'));
        } catch (error) {
            console.error("Error al intentar parsear los datos del usuario:", error);
        }

     

        if (storedUserAuth === 'true' && storedUser) {
            setIsAuthenticated(true);
            setUser(storedUser);
        }

        if (storedDriverAuth === 'true' && storedDriver) {
            console.log('Stored driver:', storedDriver);  // Verifica los datos del repartidor

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
        console.log('Driver data received:', driverData); // Verifica que se reciben todos los datos
        if (driverData && driverData.id_repartidor) { // Asegúrate de que el `id_repartidor` esté presente
            setIsDriverAuthenticated(true);
            setDriver(driverData);
            localStorage.setItem('isDriverAuthenticated', 'true');
            localStorage.setItem('driver', JSON.stringify(driverData));
            console.log('Driver data saved to localStorage:', JSON.stringify(driverData));
            navigate(`/repartidor/${driverData.id_repartidor}`);
        } else {
            console.error('No driver id_repartidor or data received!');
        }
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
