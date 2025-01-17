import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import './FoodItem.css';
import PropTypes from 'prop-types';
import defaultImage from '../../assets/default.png';

const FoodItem = ({ id, name, price, description, image }) => {
  const [itemCount, setItemCount] = useState(0);
  const navigate = useNavigate(); // Usamos el hook useNavigate

  const imageSrc = image || defaultImage;

  // Función para manejar el clic en el plato y navegar a la página de detalles
  const handleClick = () => {
    navigate(`/order/${id}`); // Redirige a la ruta de detalles del plato con el id
  };

  return (
    <div className='food-item' onClick={handleClick}> {/* Añadimos onClick para navegar */}
      <div className="food-item-img-container">
        <img className='food-item-image' src={imageSrc} alt={name} />
        {!itemCount 
          ?<img className='add' onClick={() => setItemCount(prev => prev + 1)} src={defaultImage} alt='' />
          :<div className='food-item-counter'>
            <img onClick={() => setItemCount(prev => prev - 1)} src={defaultImage} alt='' />
            <p>{itemCount}</p>
            <img onClick={() => setItemCount(prev => prev + 1)} src={defaultImage} alt='' />
          </div>
        }
      </div>
      <div className="food-item-info">
        <div className='food-item-info-name'>
          <p>{name}</p>
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
}

FoodItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
};

export default FoodItem;
