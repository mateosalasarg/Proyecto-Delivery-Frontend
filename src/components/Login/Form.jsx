import React from "react";

const Form = ({ type, onSubmit }) => {
  return (
    <div className="form-information">
      <div className="form-information-childs">
        <h2>{type === "register" ? "Crear una Cuenta" : "Iniciar Sesión"}</h2>
        <p>
          {type === "register"
            ? "Usa tu email para registrarte"
            : "Con una cuenta email o celular"}
        </p>
        <form className={`form form-${type}`} onSubmit={onSubmit}>
          {type === "register" && (
            <div>
              <label>
                <input type="text" placeholder="Nombre Completo" name="userName" required />
              </label>
            </div>
          )}
          <div>
            <label>
              <input type="email" placeholder="Correo Electrónico" name="userEmail" required />
            </label>
          </div>    
          
          <input type="submit" value={type === "register" ? "Registrarse" : "Iniciar Sesión"} />
        </form>
      </div>
    </div>
  );
};

export default Form;
