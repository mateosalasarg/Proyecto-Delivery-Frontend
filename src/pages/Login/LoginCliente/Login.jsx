import { useState } from "react";
import useAuth from "../../../auth/useAuth"; // Importa el hook useAuth
import "./style.css"; // Asegúrate de importar tus estilos

const Login = () => {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [domicilio, setDomicilio] = useState("");  // Nuevo campo domicilio
  const [telefono, setTelefono] = useState("");   // Nuevo campo teléfono
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    // Verificamos que los campos esenciales estén completos
    if (!nombre || !email || !domicilio) {
      setError("El nombre, correo y domicilio son obligatorios.");
      return;
    }
  
    const newClient = {
      nombre,
      correo: email,  
      domicilio,
      telefono: telefono || "", // El teléfono es opcional
    };
  
    try {
      const response = await fetch("http://127.0.0.1:5000/clientes/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newClient),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.message === "Cliente creado exitosamente") {
          alert("Cliente registrado exitosamente");
          setError(""); // Limpiar el mensaje de error
          toggleForm(); // Cambiar a la vista de inicio de sesión
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al registrar el cliente.");
      }
    } catch (error) {
      setError("Hubo un problema al realizar la solicitud.");
      console.error("Error al hacer la solicitud:", error); // Ver detalles del error en la consola
    }
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
                    <input
                      type="text"
                      placeholder="Nombre Completo"
                      name="userName"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="email"
                      placeholder="Correo Electrónico"
                      name="userEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="text"
                      placeholder="Domicilio"
                      name="domicilio"
                      value={domicilio}
                      onChange={(e) => setDomicilio(e.target.value)}
                    />
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="text"
                      placeholder="Teléfono (Opcional)"
                      name="telefono"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
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
