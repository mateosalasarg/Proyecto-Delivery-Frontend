import { useContext } from 'react'; // Asegúrate de importar useContext
import { AuthContext } from '../../auth/AuthContext'; // Importa el contexto

const Home = () => {
    const { user } = useContext(AuthContext);  // Accede a los datos del usuario desde el contexto

    if (!user) {
        return <div>Acceso no autorizado</div>;  // Si no hay usuario, muestra un mensaje
    }

    return (
        <div>
            <h1>Hola, {user.nombre}</h1> {/* Muestra el nombre del cliente */}
            <p>Estos son tus datos:</p>
            <ul>
                <li>Correo: {user.correo}</li>
                <li>Domicilio: {user.domicilio}</li>
                <li>Teléfono: {user.telefono}</li>
            </ul>
        </div>
    );
};

export default Home;
