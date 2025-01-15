import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Importa el contexto

// Define el hook useAuth para acceder al contexto
const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context; // Devuelve el valor del contexto
};

export default useAuth;
