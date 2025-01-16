import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Importamos useNavigate
import './FoodDetails.css';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para navegar
  const [foodDetails, setFoodDetails] = useState(null);

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/platos/${id}`);
        const data = await response.json();
        setFoodDetails(data);
      } catch (error) {
        console.error("Error fetching food details:", error);
      }
    };

    fetchFoodDetails();
  }, [id]);

  if (!foodDetails) {
    return <div>Loading...</div>;
  }

  const handleOrder = () => {
    navigate(`/order/${id}`); // Redirige al formulario de pedido
  };

  return (
    <div className="food-details">
      <h2>{foodDetails.nombre}</h2>
      <p>{foodDetails.descripcion}</p>
      <p>Precio: ${foodDetails.precio}</p>
      <button onClick={handleOrder}>Hacer Pedido</button> {/* Botón para hacer pedido */}
    </div>
  );
};

export default FoodDetails;
