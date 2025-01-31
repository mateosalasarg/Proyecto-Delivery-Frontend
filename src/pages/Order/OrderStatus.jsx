import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../auth/AuthContext'; // Asegúrate de importar el contexto
import './OrderStatus.css';

const OrderStatus = () => {
  const { user, isAuthenticated } = useContext(AuthContext); // Obtener el id_cliente desde el contexto
  const [orderDetails, setOrderDetails] = useState([]);
  const [repartidorDetails, setRepartidorDetails] = useState({});
  const [platosDetails, setPlatosDetails] = useState([]); // Estado para almacenar los detalles de los platos
  const [loading, setLoading] = useState(true);

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
          setOrderDetails(data); // Aquí guardamos todos los pedidos

          // Obtenemos el nombre del repartidor (si existe) para todos los pedidos
          const repartidorId = data[0]?.id_repartidor; // Suponiendo que el repartidor es el mismo para todos los pedidos
          if (repartidorId) {
            const repartidorResponse = await fetch(`https://deliverynono.pythonanywhere.com/repartidores/${repartidorId}`);
            const repartidorData = await repartidorResponse.json();
            setRepartidorDetails(repartidorData);
          }

          // Obtener los detalles de los platos basados en los ids de todos los pedidos
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
  }, [user, isAuthenticated]); // Asegurarse de que la consulta se vuelva a ejecutar si cambia el usuario o el estado de autenticación

  if (loading) {
    return <div>Cargando estado del pedido...</div>;
  }

  if (!orderDetails || orderDetails.length === 0) {
    return <div>No se pudieron encontrar pedidos.</div>;
  }

  // Verificar que el objeto orderDetails y su propiedad repartidor existan antes de acceder a ellas
  const repartidorNombre = repartidorDetails?.nombre || 'No asignado';

  return (
    <div className="order-status">
      <h2>Estado de Pedidos</h2>
      {orderDetails.map((order) => {
        const estadoPedido = order?.estado || 'Estado no disponible';
        const domicilioEntrega = order?.domicilio_entrega || 'Domicilio no disponible';

        return (
          <div key={order.id_pedido} className="order">
            <p><strong>Pedido ID:</strong> {order.id_pedido}</p>
            <p><strong>Dirección de Entrega:</strong> {domicilioEntrega}</p>
            <p><strong>Repartidor Asignado:</strong> {repartidorNombre}</p>
            <p><strong>Estado:</strong> {estadoPedido}</p>
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
        );
      })}
    </div>
  );
};

export default OrderStatus;
