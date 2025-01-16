import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // Para obtener el ID del plato seleccionado
import { AuthContext } from '../../auth/AuthContext'; // Importa el contexto de autenticación
import './OrderForm.css';

const OrderForm = () => {
  const { id } = useParams(); // Obtenemos el ID del plato desde la URL
  const { user, isAuthenticated } = useContext(AuthContext); // Accede al contexto de autenticación
  const [foodDetails, setFoodDetails] = useState(null);
  const [quantity, setQuantity] = useState(1); // Cantidad del plato
  const [deliveryAddress, setDeliveryAddress] = useState(""); // Dirección de entrega
  const [comments, setComments] = useState(""); // Comentarios del cliente
  const [loading, setLoading] = useState(true);

  // Verificamos si el usuario está autenticado
  if (!isAuthenticated) {
    return <div>Debes iniciar sesión para realizar un pedido.</div>;
  }

  // Al cargar el componente, obtenemos los detalles del plato
  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/platos/${id}`); // Obtenemos los detalles del plato
        const data = await response.json();
        setFoodDetails(data);
      } catch (error) {
        console.error("Error fetching food details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails(); // Cargar los detalles del plato
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      id_cliente: user.id_cliente, // Usamos el id_cliente desde el contexto
      domicilio_entrega: deliveryAddress,
      platos: [
        {
          id_plato: parseInt(id), // Convertir a entero
          cantidad: quantity,
        },
      ],
      comentarios: comments || "", // Enviar los comentarios si hay, sino una cadena vacía
    };

    try {
      console.log(orderData);

      const response = await fetch("http://127.0.0.1:5000/pedidos/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData), // Enviar los datos al backend
      });

      const data = await response.json();

      if (response.ok) {
        alert("Pedido realizado con éxito!");
      } else {
        alert("Error al realizar el pedido: " + data.error);
      }
    } catch (error) {
      console.error("Error making order:", error);
      alert("Hubo un error al hacer el pedido.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-form">
      <h2>Realizar Pedido</h2>
      <h3>{foodDetails.nombre}</h3>
      <p>{foodDetails.descripcion}</p>
      <p>Precio: ${foodDetails.precio}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="quantity">Cantidad:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

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
            placeholder="Escribe tus comentarios aquí..."
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
