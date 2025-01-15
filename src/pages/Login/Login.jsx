import { useState } from "react";
import useAuth from "../../auth/useAuth"; // Importa el hook useAuth
import "./styles/style.css"; // Asegúrate de importar tus estilos

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Estado para alternar entre registro e inicio de sesión
  const { login } = useAuth(); // Usamos la función de login del contexto

  const toggleForm = () => {
    setIsRegistering(!isRegistering); // Alterna entre los formularios
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://127.0.0.1:5000/clientes/${email}`);
      if (response.ok) {
        const data = await response.json();
        if (data.id_cliente) {
          login(data); // Pasa los datos del cliente a la función de login
        } else {
          setError("El correo no está asociado a ningún cliente.");
        }
      } else {
        const errorData = await response.json();
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

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert("Formulario de registro enviado con éxito");
  };

  return (
    <div className={`container-form ${isRegistering ? "register" : "login"}`}>
      {isRegistering ? (
        <>
          <div className="information">
            <div className="info-childs">
              <h2>Bienvenido</h2>
              <p>Para unirte a nuestra comunidad, regístrate con tus datos.</p>
              <input type="button" value="Iniciar Sesión" onClick={toggleForm} />
            </div>
          </div>
          <div className="form-information">
            <div className="form-information-childs">
              <h2>Crear una Cuenta</h2>
              <p>Usa tu email para registrarte.</p>
              <form className="form form-register" onSubmit={handleRegisterSubmit}>
                <div>
                  <label>
                    <input type="text" placeholder="Nombre Completo" name="userName" required />
                  </label>
                </div>
                <div>
                  <label>
                    <input type="email" placeholder="Correo Electrónico" name="userEmail" required />
                  </label>
                </div>
                <input type="submit" value="Registrarse" />
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="information">
            <div className="info-childs">
              <h2>¡Bienvenido nuevamente!</h2>
              <p>Inicia sesión con tus datos para continuar.</p>
              <input type="button" value="Registrarse" onClick={toggleForm} />
            </div>
          </div>
          <div className="form-information">
            <div className="form-information-childs">
              <h2>Iniciar Sesión</h2>
              <p>Con una cuenta email o celular.</p>
              <form className="form form-login" onSubmit={handleLoginSubmit}>
                <div>
                  <label>
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <button type="submit">Iniciar Sesión</button>
              </form>
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
