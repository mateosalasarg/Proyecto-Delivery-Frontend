import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../../../auth/AuthContext';

const DriverLogin = () => {
  const [telefono, setTelefono] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginDriver } = useContext(AuthContext); // Usamos loginDriver

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/repartidores/login', {
        telefono,
        contraseña,
      });

      if (response.status === 200) {
        loginDriver(response.data.repartidorData); // Usar loginDriver del contexto
        navigate(`/repartidor/${repartidorId}`); // Redirigimos al perfil usando la id del repartidor
      }
    } catch (err) {
      setError('Error al intentar iniciar sesión. Intente nuevamente.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Inicio de Sesión - Repartidor</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg"
              placeholder="Ingrese su teléfono"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="mt-1 p-2 w-full border rounded-lg"
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default DriverLogin;
