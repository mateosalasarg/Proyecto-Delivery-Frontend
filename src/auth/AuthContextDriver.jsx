import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const DriverAuthContext = createContext();

const DriverAuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [driver, setDriver] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const storedAuth = localStorage.getItem('isDriverAuthenticated');
        const storedDriver = JSON.parse(localStorage.getItem('driver'));
        if (storedAuth === 'true' && storedDriver) {
            setIsAuthenticated(true);
            setDriver(storedDriver);
        }
    }, []);

    const login = (driverData) => {
        setIsAuthenticated(true);
        setDriver(driverData);
        localStorage.setItem('isDriverAuthenticated', 'true');
        localStorage.setItem('driver', JSON.stringify(driverData));
        navigate('/repartidor');
    };

    const logout = () => {
        setIsAuthenticated(false);
        setDriver(null);
        localStorage.removeItem('isDriverAuthenticated');
        localStorage.removeItem('driver');
        navigate('/'); // Redirige al login
    };

    return (
        <DriverAuthContext.Provider value={{ isAuthenticated, driver, login, logout }}>
            {children}
        </DriverAuthContext.Provider>
    );
};

DriverAuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { DriverAuthProvider, DriverAuthContext };
