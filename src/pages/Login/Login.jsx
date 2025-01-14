import { useState } from 'react';
import useAuth from '../../auth/useAuth'; // Importa el hook useAuth

const Login = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth(); // Usamos la función de login del contexto

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://127.0.0.1:5000/clientes/${email}`);

            if (response.ok) {
                const data = await response.json();
                if (data.id_cliente) {
                    login(data);  // Pasa los datos del cliente a la función de login
                } else {
                    setError("El correo no está asociado a ningún cliente.");
                }
            } else {
                // Si la respuesta tiene un código 404, se puede mostrar el mensaje adecuado
                const errorData = await response.json();  // Capturamos el mensaje de error detallado
                if (errorData.error && errorData.error.code === 404) {
                    setError("El correo no está registrado en nuestra base de datos.");
                } else {
                    setError("Error al comunicarse con el servidor.");
                }
            }
        } catch (error) {
            setError("Hubo un problema al realizar la solicitud.");
        }
    };

    return (
        <div>
            <h1>Inicio de Sesión</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Correo Electrónico:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Enviar</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
