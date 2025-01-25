import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DriverLogin = () => {
  const [telefono, setTelefono] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/repartidores/login", {
        telefono,
        contraseña,
      });

      if (response.status === 200) {
        // Guardar el token y datos del repartidor en el localStorage
        localStorage.setItem("repartidorToken", response.data.token); // Si la API devuelve un token
        localStorage.setItem("repartidorId", response.data.repartidorId); // Almacena la ID del repartidor si es necesario
        localStorage.setItem("repartidorData", JSON.stringify(response.data.repartidorData)); // Almacena los datos del repartidor completos

        navigate("/repartidor"); // Redirigir al perfil del repartidor
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Teléfono o contraseña incorrectos.");
      } else {
        setError("Error al intentar iniciar sesión. Intente nuevamente.");
      }
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
