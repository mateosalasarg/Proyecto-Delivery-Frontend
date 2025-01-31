import { useState } from "react";
import useAuth from "../../../auth/useAuth";
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { loginClient } = useAuth();

  const toggleForm = () => setIsRegistering(!isRegistering);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !contraseña) {
      setError("Correo y contraseña son obligatorios.");
      return;
    }

    try {
      const response = await fetch("https://deliverynono.pythonanywhere.com/clientes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contraseña }),
      });

      if (response.ok) {
        const data = await response.json();
        loginClient(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Correo o contraseña incorrectos.");
      }
    } catch {
      setError("Error al conectar con el servidor.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !email || !domicilio || !contraseña) {
      setError("Todos los campos son obligatorios, excepto teléfono.");
      return;
    }

    try {
      const response = await fetch("https://deliverynono.pythonanywhere.com/clientes/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, correo: email, domicilio, telefono, contraseña }),
      });

      if (response.ok) {
        alert("Cliente registrado exitosamente.");
        setError("");
        toggleForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error al registrar el cliente.");
      }
    } catch {
      setError("Error al conectar con el servidor.");
    }
  };

  return (
  <div className={`login-container ${isRegistering ? "register" : "login"}`}>
      {isRegistering ? (
        <>
          <div className="information">
            
            <h2>Bienvenido</h2>
            <p>Regístrate para unirte a nuestra comunidad.</p>
            <button onClick={toggleForm}>Iniciar Sesión</button>
          </div>
          <form className="form" onSubmit={handleRegisterSubmit}>
            <h2>Registro</h2>
            <input
              type="text"
              placeholder="Nombre Completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Domicilio"
              value={domicilio}
              onChange={(e) => setDomicilio(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Teléfono (Opcional)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <button type="submit">Registrarse</button>
            {error && <p className="error">{error}</p>}
          </form>
        </>
      ) : (
        <>
          <div className="information">
            <h2>Bienvenido</h2>
            <p>Inicia sesión para continuar.</p>
            <button onClick={toggleForm}>Registrarse</button>
          </div>
          <form className="form" onSubmit={handleLoginSubmit}>
            <h2>Inicio de Sesión</h2>
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <button type="submit">Iniciar Sesión</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            </form>
        </>
      )}
    </div>
  );
};

export default Login;
