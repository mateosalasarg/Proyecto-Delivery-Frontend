import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import "./style1.css";

const DriverProfile = () => {
  const navigate = useNavigate();
  const { driver } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState([]);
  const [repartidor, setRepartidor] = useState(null); // Estado para los detalles del repartidor
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!driver) {
      navigate("/login");
      return;
    }

    // Obtener información del repartidor
    fetch(`http://127.0.0.1:5000/repartidores/${driver.id_repartidor}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al cargar los datos del repartidor");
        }
        return response.json();
      })
      .then((data) => {
        setRepartidor(data);
      })
      .catch((error) => {
        console.error("Error fetching driver details:", error);
        setError("Error al cargar los datos del repartidor");
      });

    // Obtener los pedidos asignados al repartidor
    fetch(`http://127.0.0.1:5000/pedidos/repartidores/${driver.id_repartidor}`)
      .then((response) => {
        if (response.status === 404) {
          setError("No tiene pedidos asignados, comuníquese con el administrador.");
          return []; // Si no tiene pedidos, retornamos un array vacío
        }
        if (!response.ok) {
          throw new Error("Error al cargar los pedidos del repartidor");
        }
        return response.json();
      })
      .then((data) => {
        setPedidos(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setError("Error al cargar los pedidos del repartidor");
      });
  }, [driver, navigate]);

  const updatePedido = (id, body, successMessage) => {
    fetch(`http://127.0.0.1:5000/pedidos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la actualización del pedido");
        }
        return response.json();
      })
      .then(() => {
        setPedidos((prevPedidos) =>
          prevPedidos.map((pedido) =>
            pedido.id_pedido === id
              ? { ...pedido, ...body } // Actualiza los valores dinámicamente
              : pedido
          )
        );
        alert(successMessage);
      })
      .catch((error) => {
        console.error(error);
        alert("No se pudo actualizar el pedido");
      });
  };

  const markAsDelivered = (id) => {
    updatePedido(
      id,
      { field: "estado", value: "En camino" },
      `El pedido #${id} fue marcado como "En camino".`
    );
  };

  const markAsRejected = (id) => {
    updatePedido(
      id,
      { field: "id_repartidor", value: null },
      `El pedido #${id} fue rechazado.`
    );
  };

  if (error) {
    return (
      <div>
        {repartidor && (
          <div>
            <h2>Información del Repartidor:</h2>
            <p><strong>Nombre:</strong> {repartidor.nombre}</p>
            <p><strong>Correo:</strong> {repartidor.correo}</p>
            <p><strong>Teléfono:</strong> {repartidor.telefono}</p>
          </div>
        )}
        <div>{error}</div>
      </div>
    ); // Mostrar mensaje de error y la información del repartidor
  }

  if (!pedidos.length) {
    return (
      <div>
        {repartidor && (
          <div>
            <h2>Información del Repartidor:</h2>
            <p><strong>Nombre:</strong> {repartidor.nombre}</p>
            <p><strong>Disponible:</strong> {repartidor.disponible}</p>
            <p><strong>Teléfono:</strong> {repartidor.telefono}</p>
          </div>
        )}
        <div>No tiene pedidos asignados, comuníquese con el administrador.</div>
      </div>
    ); // Mostrar la información del repartidor con el mensaje de no tener pedidos
  }

  return (
    <div className="driver-profile">
      <h2>Pedidos asignados al Repartidor</h2>
      <div className="orders-list">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id_pedido}
            className={`order-item ${
              pedido.estado === "Entregado"
                ? "completed"
                : pedido.estado === "Rechazado"
                ? "rejected"
                : ""
            }`}
          >
            <h3>Pedido #{pedido.id_pedido}</h3>
            <p>
              <strong>Domicilio de entrega:</strong> {pedido.domicilio_entrega}
            </p>
            <p>
              <strong>Estado:</strong> {pedido.estado}
            </p>
            <p>
              <strong>Pagado:</strong> {pedido.pagado === 1 ? "Sí" : "No"}
            </p>
            <p>
              <strong>Fecha y hora:</strong>{" "}
              {new Date(pedido.fecha_hora).toLocaleString()}
            </p>
            <div className="order-details">
              <h4>Detalles:</h4>
              <ul>
                {pedido.detalles.map((detalle, index) => (
                  <li key={index}>
                    <strong>Plato #{detalle.id_plato}:</strong>{" "}
                    {detalle.cantidad} unidades - {detalle.comentario}
                  </li>
                ))}
              </ul>
            </div>
            {pedido.estado === "Pendiente" && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => markAsDelivered(pedido.id_pedido)}
                  style={{ marginRight: "10px" }}
                >
                  Marcar como En camino
                </button>
                <button
                  onClick={() => markAsRejected(pedido.id_pedido)}
                  className="reject-button"
                >
                  Rechazar Pedido
                </button>
              </div>
            )}

            {pedido.estado === "Entregado" && (
              <p className="completed-message">Pedido Entregado</p>
            )}
            {pedido.estado === "Rechazado" && (
              <p className="rejected-message">Pedido Rechazado</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverProfile;
