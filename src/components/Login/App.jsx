import React, { useState } from "react";
import InfoSection from "./components/InfoSection";
import Form from "./components/Form";
import "./styles/style.css";

const App = () => {
  const [isRegistering, setIsRegistering] = useState(true); // Estado para alternar formularios

  // Función para alternar entre los formularios
  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  // Manejo de envío de formularios
  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Formulario enviado con éxito");
  };

  return (
    <div className={`container-form ${isRegistering ? "register" : "login"}`}>
      {isRegistering ? (
        <>
          {/* Sección de Información para Registro */}
          <InfoSection
            title="Bienvenido"
            description="Para unirte a nuestra comunidad por favor Inicia Sesión con tus datos"
            buttonText="Iniciar Sesión"
            onToggle={toggleForm}
          />
          {/* Formulario de Registro */}
          <Form type="register" onSubmit={handleFormSubmit} />
        </>
      ) : (
        <>
          {/* Sección de Información para Login */}
          <InfoSection
            title="¡Bienvenido nuevamente!"
            description="Inicia sesión con tus datos para continuar"
            buttonText="Registrarse"
            onToggle={toggleForm}
          />
          {/* Formulario de Inicio de Sesión */}
          <Form type="login" onSubmit={handleFormSubmit} />
        </>
      )}
    </div>
  );
};

export default App;
