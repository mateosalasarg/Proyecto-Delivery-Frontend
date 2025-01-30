import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import "./style1.css";

const DriverProfile = () => {
  const navigate = useNavigate();
  const { driver, setDriver } = useContext(AuthContext); // Contexto para manejar el estado del repartidor
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar el error
    const { logout } = useContext(AuthContext); // Obtén la función de logout desde el contexto

  useEffect(() => {
    if (!driver) {
      navigate("/login");
      return;
    }

    fetch(`https://deliverynono.pythonanywhere.com/pedidos/repartidores/${driver.id_repartidor}`)
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
    fetch(`https://deliverynono.pythonanywhere.com/pedidos/${id}`, {
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
  const markAsEntregado = (id) => {
    updatePedido(
      id,
      { field: "estado", value: "Entregado" },
      `El pedido #${id} fue marcado como "Entregado".`
    );
  };

  const markAsRejected = (id) => {
    updatePedido(
      id,
      { field: "id_repartidor", value: null },
      `El pedido #${id} fue rechazado.`
    );
  };

  const toggleDisponibilidad = () => {
    // Cambiar entre disponible (1) y no disponible (2)
    const nuevoEstado = driver.disponible === 1 ? 2 : 1;
    console.log("Nuevo estado:", nuevoEstado);

    fetch(`https://deliverynono.pythonanywhere.com/repartidores/${driver.id_repartidor}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        field: "disponible",
        value: nuevoEstado,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar la disponibilidad del repartidor");
        }
        return response.json();
      })
      .then(() => {
        // Actualizar el contexto con el nuevo estado de disponibilidad
        setDriver((prevDriver) => ({
          ...prevDriver,
          disponible: nuevoEstado,
        }));

        alert(`Disponibilidad actualizada a: ${nuevoEstado === 1 ? "Disponible" : "No Disponible"}`);
      })
      .catch((error) => {
        console.error(error);
        alert("No se pudo actualizar la disponibilidad del repartidor");
      });
  };
  const handleLogout = () => {
    logout(); // Llama a la función logout para eliminar la autenticación
    navigate('/repartidor/login'); // Redirige a la página de login
};



  return (
    <div className="driver-profile">
      <div className="driver-info">
        <h2>Información del Repartidor</h2>
        <p><strong>Nombre:</strong> {driver.nombre}</p>
        <p><strong>Disponible:</strong> {driver.disponible === 1 ? "Sí" : "No"}</p>
        <p><strong>Teléfono:</strong> {driver.telefono}</p>
        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>

        {/* Botones para cambiar el estado de disponibilidad */}
        <button
          className={driver.disponible === 1 ? "btn-disponible" : "btn-no-disponible"}
          onClick={toggleDisponibilidad}
        >
          {driver.disponible === 1 ? "Disponible" : "No Disponible"}
        </button>

        {/* Botón rojo "No Disponible" */}
        {driver.disponible === 1 && (
          <button
            className="btn-no-disponible-red"
            onClick={toggleDisponibilidad}
            style={{ backgroundColor: "red", color: "white" }}
          >
            No Disponible
          </button>
        )}
      </div>


      <h2>Pedidos asignados al Repartidor</h2>
      <div className="orders-list">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id_pedido}
            className={`order-item ${pedido.estado === "Entregado" ? "completed" : pedido.estado === "Rechazado" ? "rejected" : ""}`}
          >
            <h3>Pedido #{pedido.id_pedido}</h3>
            <p><strong>Domicilio de entrega:</strong> {pedido.domicilio_entrega}</p>
            <p><strong>Estado:</strong> {pedido.estado}</p>
            <p><strong>Pagado:</strong> {pedido.pagado === 1 ? "Sí" : "No"}</p>
            <p><strong>Fecha y hora:</strong> {new Date(pedido.fecha_hora).toLocaleString()}</p>
            <div className="order-details">
              <h4>Detalles:</h4>
              <ul>
                {pedido.detalles.map((detalle, index) => (
                  <li key={index}>
                    <strong>Plato #{detalle.id_plato}:</strong> {detalle.cantidad} unidades - {detalle.comentario}
                  </li>
                ))}
              </ul>
              {pedido.estado === "En camino" && (
                <div style={{ marginTop: "10px" }}>
                  <button onClick={() => markAsEntregado(pedido.id_pedido)} style={{ marginRight: "10px" }}>
                    Marcar como Entregado
                  </button>
                  <button onClick={() => markAsRejected(pedido.id_pedido)} className="reject-button">
                    Rechazar Pedido
                  </button>
                </div>
              )}

            </div>
            {pedido.estado === "Pendiente" && (
              <div style={{ marginTop: "10px" }}>
                <button onClick={() => markAsDelivered(pedido.id_pedido)} style={{ marginRight: "10px" }}>
                  Marcar como En camino
                </button>
                <button onClick={() => markAsRejected(pedido.id_pedido)} className="reject-button">
                  Rechazar Pedido
                </button>
                
              </div>
            )}
            {pedido.estado === "Entregado" && <p className="completed-message">Pedido Entregado</p>}
            {pedido.estado === "Rechazado" && <p className="rejected-message">Pedido Rechazado</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverProfile;
