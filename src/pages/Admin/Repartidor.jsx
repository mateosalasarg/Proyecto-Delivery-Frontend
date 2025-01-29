import React, { useEffect, useState } from "react";
import "../Admin/StylesAdmin/Repartidores.css";

const API_URL = "http://127.0.0.1:5000/repartidores"; // Reemplaza con la URL real de tu API
const API_CREAR_URL = "http://127.0.0.1:5000/repartidores/crear"; // URL para crear un repartidor

const Repartidores = () => {
  const [repartidores, setRepartidores] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", telefono: "", disponible: "1", contraseña: "" });

  useEffect(() => {
    fetchRepartidores();
  }, []);

  const fetchRepartidores = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setRepartidores(data);
    } catch (error) {
      console.error("Error al obtener repartidores:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_CREAR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ nombre: "", telefono: "", disponible: "1", contraseña: "" });
        fetchRepartidores();
      } else {
        console.error("Error al crear repartidor:", response.statusText);
      }
    } catch (error) {
      console.error("Error al crear repartidor:", error);
    }
  };

  const handleEdit = async (id, field, value) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      if (response.ok) {
        fetchRepartidores();
      } else {
        console.error("Error al editar repartidor:", response.statusText);
      }
    } catch (error) {
      console.error("Error al editar repartidor:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchRepartidores();
      } else {
        console.error("Error al eliminar repartidor:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar repartidor:", error);
    }
  };

  return (
    <div className="repartidores-container">
      <h2>Gestión de Repartidores</h2>

      <form onSubmit={handleCreate} className="repartidores-form">
        <input
          type="text"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
          required
        />
        <select
          value={formData.disponible}
          onChange={(e) => setFormData({ ...formData, disponible: e.target.value })}
        >
          <option value="1">Disponible</option>
          <option value="2">No Disponible</option>
        </select>
        <button type="submit">Crear</button>
      </form>

      <ul className="repartidores-list">
        {repartidores.map((r) => (
          <li key={r.id_repartidor} className="repartidor-item">
            <span>{r.nombre} - {r.telefono} - {r.disponible === 1 ? "Disponible" : "No Disponible"}</span>
            <button
              onClick={() => handleEdit(r.id_repartidor, "disponible", r.disponible === 1 ? "2" : "1")}
            >
              Cambiar Estado
            </button>
            <button onClick={() => handleDelete(r.id_repartidor)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Repartidores;
