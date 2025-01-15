import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes
import './Food.css';
import FoodItem from '../FoodItem/FoodItem';

const Food = ({ category }) => {
  const [foodList, setFoodList] = useState([]);  // Estado para los platos
  const [loading, setLoading] = useState(true);  // Estado para el cargando

  useEffect(() => {
    // Función para obtener los datos del backend
    const fetchFoodData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/platos/');
        const data = await response.json();
        setFoodList(data); // Almacena los datos en el estado
      } catch (error) {
        console.error('Error fetching food data:', error);
      } finally {
        setLoading(false); // Finaliza el cargado
      }
    };

    fetchFoodData(); // Llama a la función al montar el componente
  }, []); // Se ejecuta solo una vez al montar el componente

  if (loading) {
    return <div>Loading...</div>; // Mostrar cargando mientras se obtiene la data
  }

  return (
    <div className="food" id="food">
      <div className="food-list">
        {foodList.map((item, index) => {
          return (
            <FoodItem
              key={index}
              id={item.id_plato} // Usamos el id desde la respuesta del backend
              name={item.nombre} // Usamos el nombre del plato
              description={item.descripcion} // Usamos la descripción del plato
              price={item.precio} // Usamos el precio del plato
              image={item.imagen || ''} // Si no hay imagen, se pasa una cadena vacía
            />
          );
        })}
      </div>
    </div>
  );
};

// Validación de props para el componente Food
Food.propTypes = {
  category: PropTypes.string.isRequired, // Validamos la prop category
};

export default Food;
