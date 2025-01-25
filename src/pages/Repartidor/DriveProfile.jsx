import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

const DriverProfile = () => {
  const { user } = useContext(AuthContext);  // Obtén los datos del repartidor desde el contexto
  const [driverData, setDriverData] = useState(null); // Estado para almacenar los datos del repartidor
  const [orders, setOrders] = useState([
    {
      id: 1,
      clientName: "Carlos Gómez",
      address: "Avenida Siempre Viva 742",
      details: "2 pizzas grandes, 1 coca cola",
      status: "Pendiente",
    },
    {
      id: 2,
      clientName: "María López",
      address: "Calle Los Pinos 123",
      details: "1 hamburguesa con papas, 1 limonada",
      status: "Pendiente",
    },
  ]);

  // Efecto para cargar los datos del repartidor al montar el componente
  useEffect(() => {
    if (user?.id) {
      fetch(`http://127.0.0.1:5000/repartidores/${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setDriverData(data); // Almacenamos los datos del repartidor
        })
        .catch((error) => {
          console.error("Error fetching driver data:", error);
        });
    }
  }, [user?.id]);

  const markAsDelivered = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "Entregado" } : order
      )
    );
    alert(`El pedido #${id} fue marcado como entregado.`);
  };

  const markAsRejected = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: "Rechazado" } : order
      )
    );
    alert(`El pedido #${id} fue rechazado.`);
  };

  if (!driverData) {
    return <div>Cargando perfil...</div>;  // Muestra un mensaje mientras se cargan los datos
  }

  return (
    <div className="driver-profile">
      <h2>Perfil del Repartidor</h2>
      <div className="profile-info">
        <label>
          Nombre: <span id="name-display">{driverData.name}</span>
        </label>
        <label>
          Correo Electrónico: <span id="email-display">{driverData.email}</span>
        </label>
        <label>
          Teléfono: <span id="phone-display">{driverData.phone}</span>
        </label>
        <label>
          Dirección: <span id="address-display">{driverData.address}</span>
        </label>
      </div>

      <h2>Pedidos Asignados</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`order-item ${
              order.status === "Entregado" ? "completed" : ""
            } ${order.status === "Rechazado" ? "rejected" : ""}`}
          >
            <h3>Pedido #{order.id}</h3>
            <p>
              <strong>Cliente:</strong> {order.clientName}
            </p>
            <p>
              <strong>Dirección:</strong> {order.address}
            </p>
            <p>
              <strong>Detalles:</strong> {order.details}
            </p>
            <p>
              <strong>Estado:</strong> {order.status}
            </p>
            {order.status === "Pendiente" ? (
              <>
                <button onClick={() => markAsDelivered(order.id)}>
                  Marcar como Entregado
                </button>
                <button
                  onClick={() => markAsRejected(order.id)}
                  className="reject-button"
                >
                  Rechazar Pedido
                </button>
              </>
            ) : order.status === "Entregado" ? (
              <p className="completed-message">Pedido Entregado</p>
            ) : (
              <p className="rejected-message">Pedido Rechazado</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverProfile;
