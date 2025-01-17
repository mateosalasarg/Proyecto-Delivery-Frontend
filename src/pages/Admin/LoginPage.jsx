import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const [dni, setDni] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/admin/login', {
        dni,
        contraseña
      });
      
      if (response.status === 200) {
        localStorage.setItem('adminToken', response.data.token);
        window.location.href = '/dashboard';  // Redirigir a la página de administrador
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
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>DNI</label>
          <input 
            type="text" 
            value={dni} 
            onChange={(e) => setDni(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Contraseña</label>
          <input 
            type="password" 
            value={contraseña} 
            onChange={(e) => setContraseña(e.target.value)} 
            required 
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;
