import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Para obtener datos pasados y redirigir
import { AuthContext } from '../../auth/AuthContext';
import './OrderForm.css';

const OrderForm = () => {
  const { state } = useLocation(); // Obtener el carrito desde la navegación
  const { carrito } = state || { carrito: [] };
  const { user, isAuthenticated } = useContext(AuthContext);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [comments, setComments] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    console.log("Carrito recibido:", location.state?.carrito);

    if (carrito.length === 0) {
      alert("No hay artículos en el carrito. Redirigiendo al menú.");
      navigate("/menu");
    }
  }, [carrito, navigate]);
  if (!isAuthenticated) {
    return <div>Debes iniciar sesión para realizar un pedido.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const repartidorResponse = await fetch("http://127.0.0.1:5000/repartidores/disponibles");
      const repartidores = await repartidorResponse.json();

      if (repartidores.length === 0) {
        alert("No hay repartidores disponibles. Intente más tarde.");
        return;
      }

      const repartidorAsignado = repartidores[0];

      const orderData = {
        id_cliente: user.id_cliente,
        domicilio_entrega: deliveryAddress,
        id_repartidor: repartidorAsignado.id_repartidor,
        platos: carrito.map((item) => ({
          id_plato: item.id,
          cantidad: item.cantidad,
        })),
        comentarios: comments || "",
      };

      const response = await fetch("http://127.0.0.1:5000/pedidos/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pedido realizado con éxito!");
        navigate('/estado-pedido/'); // Redirigir al estados de los pedidos del cliente 
      } else { 
        alert("Error al realizar el pedido: " + data.error);
      }
    } catch (error) {
      console.error("Error al realizar el pedido:", error);
      alert("Hubo un error al realizar el pedido.");
    }
  };

  return (
    <div className="order-form">
      <h2>Confirmar Pedido</h2>
      <ul>
        {carrito.map((item) => (
          <li key={item.id}>
            {item.nombre} - Cantidad: {item.cantidad} - ${item.precio * item.cantidad}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deliveryAddress">Dirección de Entrega:</label>
          <input
            type="text"
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="comments">Comentarios (Opcional):</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">
          Confirmar Pedido
        </button>
      </form>
    </div>
  );
};

export default OrderForm;