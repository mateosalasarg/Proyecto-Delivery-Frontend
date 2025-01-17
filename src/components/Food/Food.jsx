import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Food.css';
import FoodItem from '../FoodItem/FoodItem';

const Food = ({ category }) => {
  const [foodList, setFoodList] = useState([]);  // Estado para los platos
  const [loading, setLoading] = useState(true);  // Estado para el cargando

  useEffect(() => {
    // Función para obtener los datos del backend
    const fetchFoodData = async () => {
      try {
        let response;
        if (category === '') {
          // Si no hay categoría seleccionada, cargar todos los platos
          response = await fetch('http://127.0.0.1:5000/platos/');
        } else {
          // Si hay categoría, cargar los platos de esa categoría
          response = await fetch(`http://127.0.0.1:5000/platos/${category}`);
        }

        const data = await response.json();
        if (data.length === 0) {
          // Si no hay platos para esa categoría
          setFoodList([]);
        } else {
          setFoodList(data); // Almacena los datos en el estado
        }
      } catch (error) {
        console.error('Error fetching food data:', error);
      } finally {
        setLoading(false); // Finaliza el cargado
      }
    };

    fetchFoodData(); // Llama a la función al montar el componente o cambiar la categoría
  }, [category]); // Se ejecuta cada vez que cambia la categoría

  if (loading) {
    return <div>Loading...</div>; // Mostrar cargando mientras se obtiene la data
  }

  return (
    <div className="food" id="food">
      <div className="food-list">
        {foodList.length > 0 ? (
          foodList.map((item, index) => (
            <FoodItem
              key={index}
              id={item.id_plato} // Usamos el id desde la respuesta del backend
              name={item.nombre} // Usamos el nombre del plato
              description={item.descripcion} // Usamos la descripción del plato
              price={item.precio} // Usamos el precio del plato
              image={item.imagen || ''} // Si no hay imagen, se pasa una cadena vacía
            />
          ))
        ) : (
          <p>No hay platos disponibles para esta categoría o no hay platos en el menú.</p> // Mensaje cuando no hay platos
        )}
      </div>
    </div>
  );
};

// Validación de props para el componente Food
Food.propTypes = {
  category: PropTypes.string.isRequired, // Validamos la prop category
};

export default Food;
