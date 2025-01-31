import React, { useState, useContext } from 'react';
import axios from 'axios';
import './StylesAdmin/LoginPage.css';
import { AuthContext } from '../../auth/AuthContext'; // Importa el contexto de autenticación
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [dni, setDni] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { loginAdmin } = useContext(AuthContext); // Obtener la función loginAdmin desde el contexto
  const navigate = useNavigate(); // Hook para redirigir a la página de administración

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://deliverynono.pythonanywhere.com/admin/login', {
        dni,
        contraseña
      });

      if (response.status === 200) {
        // Llamar a loginAdmin para autenticar al admin y guardar en el contexto
        loginAdmin(response.data.admin);

        // Redirigir a la página de administrador
        navigate('/dashboard');  // O la ruta que quieras para el panel de administración
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error || 'Hubo un error en la solicitud');
      } else {
        setErrorMessage('Error de conexión');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="admin-card">
        <h3 className="admin-card__title">Bienvenido, Administrador</h3>
        <p className="admin-card__description">Aquí puedes gestionar todos los aspectos de tu negocio.</p>
      </div>
      <h2 className="login-page__title">Iniciar sesión</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-form__group">
          <label className="login-form__label">DNI</label>
          <input 
            className="login-form__input"
            type="text" 
            value={dni} 
            onChange={(e) => setDni(e.target.value)} 
            required 
          />
        </div>
        <div className="login-form__group">
          <label className="login-form__label">Contraseña</label>
          <input 
            className="login-form__input"
            type="password" 
            value={contraseña} 
            onChange={(e) => setContraseña(e.target.value)} 
            required 
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="login-form__button" type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;
