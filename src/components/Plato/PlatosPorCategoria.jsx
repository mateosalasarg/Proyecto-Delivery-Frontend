import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlatosPorCategoria = ({ category, setPlatos }) => {
  const [error, setError] = useState('');  // Estado para manejar el error
  const [loading, setLoading] = useState(false);  // Estado para controlar el loading

  useEffect(() => {
    if (category === 'All') {
      setPlatos([]);  // Limpiamos los platos si la categoría es 'All'
      return;
    }
    
    // Cargar los platos para la categoría seleccionada
    const fetchPlatos = async () => {
      setLoading(true);  // Iniciamos el loading
      setError('');  // Limpiamos el mensaje de error anterior

      try {
        const response = await axios.get(`http://127.0.0.1:5000/platos/${category}`);
        setPlatos(response.data);  // Guardamos los platos en el estado
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError('No se encuentran platos para este menú. Elija otro.');
        } else {
          setError('Ocurrió un error al cargar los platos. Intente nuevamente.');
        }
      } finally {
        setLoading(false);  // Finalizamos el loading
      }
    };

    fetchPlatos();
  }, [category, setPlatos]);  // Dependemos de la categoría

  return (
    <div className="platos-categoria">
      {loading && <p>Cargando...</p>}  {/* Mostramos un mensaje de carga mientras se obtienen los platos */}
      {error && <p className="error-message">{error}</p>}  {/* Mostramos el error si ocurre */}
    </div>
  );
}

export default PlatosPorCategoria;
