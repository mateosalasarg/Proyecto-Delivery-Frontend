import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../auth/AuthContext';
import './OrderStatus.css';

const OrderStatus = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [orderDetails, setOrderDetails] = useState([]);
  const [repartidorDetails, setRepartidorDetails] = useState({});
  const [platosDetails, setPlatosDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reclamo, setReclamo] = useState("");

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!isAuthenticated || !user || !user.id_cliente) {
        console.error("Usuario no autenticado o sin id_cliente.");
        return;
      }
      try {
        const response = await fetch(`https://deliverynono.pythonanywhere.com/pedidos/clientes/${user.id_cliente}`);
        const data = await response.json();
        if (response.ok) {
          setOrderDetails(data);
          const repartidorId = data[0]?.id_repartidor;
          if (repartidorId) {
            const repartidorResponse = await fetch(`https://deliverynono.pythonanywhere.com/repartidores/${repartidorId}`);
            const repartidorData = await repartidorResponse.json();
            setRepartidorDetails(repartidorData);
          }
          const platosIds = data.flatMap(order => order.detalles.map(item => item.id_plato));
          if (platosIds.length > 0) {
            const platosPromises = platosIds.map(id =>
              fetch(`https://deliverynono.pythonanywhere.com/platos/${id}`).then(res => res.json())
            );
            const platosData = await Promise.all(platosPromises);
            setPlatosDetails(platosData);
          }
        } else {
          console.error("Error al obtener los detalles del pedido:", data.error);
        }
      } catch (error) {
        console.error("Error al obtener el estado del pedido:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderStatus();
  }, [user, isAuthenticated]);

  const handleOpenModal = (orderId) => {
    setSelectedOrder(orderId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReclamo("");
  };

  const handleSubmitReclamo = async () => {
    if (!selectedOrder || !reclamo.trim()) return;
    try {
      const response = await fetch("https://deliverynono.pythonanywhere.com/reclamos/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_pedido: selectedOrder, descripcion: reclamo })
      });
      if (response.ok) {
        alert("Reclamo enviado exitosamente");
        handleCloseModal();
      } else {
        alert("Error al enviar el reclamo");
      }
    } catch (error) {
      console.error("Error al enviar el reclamo:", error);
    }
  };

  if (loading) return <div>Cargando estado del pedido...</div>;
  if (!orderDetails.length) return <div>No se pudieron encontrar pedidos.</div>;

  return (
    <div className="order-status">
      <h2>Estado de Pedidos</h2>
      {orderDetails.map(order => (
        <div key={order.id_pedido} className="order">
          <p><strong>Pedido ID:</strong> {order.id_pedido}</p>
          <p><strong>Dirección de Entrega:</strong> {order.domicilio_entrega || 'Domicilio no disponible'}</p>
          <p><strong>Repartidor Asignado:</strong> {repartidorDetails?.nombre || 'No asignado'}</p>
          <p><strong>Estado:</strong> {order.estado || 'Estado no disponible'}</p>
          <button onClick={() => handleOpenModal(order.id_pedido)}>Hacer Reclamo</button>
          <h3>Detalles del Pedido:</h3>
            <ul>
              {order.detalles && order.detalles.length > 0 ? (
                order.detalles.map((item) => {
                  // Buscar el nombre y la imagen del plato basado en el id
                  const plato = platosDetails.find(plato => plato.id_plato === item.id_plato);
                  const platoNombre = plato ? plato.nombre : 'Desconocido';
                  const platoImagen = plato ? plato.imagen : null;

                  return (
                    <li key={item.id_plato} className="order-item">
                      <div className="order-item-details">
                        {platoImagen && <img src={platoImagen} alt={platoNombre} className="order-item-image" />}
                        <span>{platoNombre} - Cantidad: {item.cantidad}</span>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li>No hay platos en el pedido.</li>
              )}
            </ul>
        </div>
      ))}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reclamo para Pedido {selectedOrder}</h3>
            <textarea value={reclamo} onChange={(e) => setReclamo(e.target.value)} placeholder="Escribe tu reclamo aquí..." />
            <button onClick={handleSubmitReclamo}>Enviar</button>
            <button onClick={handleCloseModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
