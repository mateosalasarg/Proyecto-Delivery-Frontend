import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

// Crea el contexto para la autenticación tanto del cliente como del repartidor y administrador
const AuthContext = createContext();

// Crea el proveedor de autenticación
const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(); // Estado para el cliente
    const [isDriverAuthenticated, setIsDriverAuthenticated] = useState(false); // Estado para el repartidor
    const [driver, setDriver] = useState(); // Estado para el repartidor
    const [isAdminAuthenticated, setAdminAuthenticated] = useState(false); // Estado para el administrador
    const [admin, setAdmin] = useState(); // Estado para el administrador
    const navigate = useNavigate();

    useEffect(() => {
        // Verificamos si hay datos guardados tanto para el cliente como para el repartidor
        const storedUserAuth = localStorage.getItem('isAuthenticated');
        let storedUser = null;
        const storedDriverAuth = localStorage.getItem('isDriverAuthenticated');
        let storedDriver = null;
        const storedAdminAuth = localStorage.getItem('isAdminAuthenticated');
        
        let storedAdmin = null;

        // Verifica si el valor en localStorage está disponible antes de intentar parsearlo
        const storedDriverData = localStorage.getItem('driver');
        if (storedDriverData) {
          try {
            storedDriver = JSON.parse(storedDriverData);
          } catch (error) {
            console.error("Error al intentar parsear los datos del repartidor:", error);
          }
        }

        const storedAdminData = localStorage.getItem('admin');
        if (storedAdminData) {
          try {
            storedAdmin = JSON.parse(storedAdminData);
          } catch (error) {
            console.error("Error al intentar parsear los datos del administrador:", error);
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
            setIsDriverAuthenticated(true);
            setDriver(storedDriver);
        }

        if (storedAdminAuth === 'true' && storedAdminData) {
            setAdminAuthenticated(true);
            setAdmin(storedAdmin);
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
        if (driverData && driverData.id_repartidor) { // Asegúrate de que el `id_repartidor` esté presente
            setIsDriverAuthenticated(true);
            setDriver(driverData);
            localStorage.setItem('isDriverAuthenticated', 'true');
            localStorage.setItem('driver', JSON.stringify(driverData));
            navigate(`/repartidor/${driverData.id_repartidor}`);
        } else {
            console.error('No driver id_repartidor or data received!');
        }
    };

    const loginAdmin = (adminData) => {
        setAdminAuthenticated(true);
        setAdmin(adminData);
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('admin', JSON.stringify(adminData));
        navigate('/admin'); // Redirige al panel de administración o la página correspondiente
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setIsDriverAuthenticated(false);
        setDriver(null);
        setAdminAuthenticated(false);
        setAdmin(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('isDriverAuthenticated');
        localStorage.removeItem('driver');
        localStorage.removeItem('isAdminAuthenticated');
        localStorage.removeItem('admin');
        navigate('/'); // Redirige a la página de login
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated, 
            user, 
            isDriverAuthenticated, 
            driver, 
            isAdminAuthenticated, // Agregado el estado del admin
            admin, // Agregado el admin
            loginClient, 
            loginDriver, 
            loginAdmin, // Agregado el login del admin
            logout,
            setDriver // Asegúrate de que setDriver esté aquí
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProvider, AuthContext };
