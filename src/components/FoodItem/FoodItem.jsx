import React, { useState } from 'react';
import './FoodItem.css';
import PropTypes from 'prop-types';

// Ruta a la imagen por defecto
import defaultImage from '../../assets/default.png'; // Asegúrate de que la ruta sea correcta

const FoodItem = ({ id, name, price, description, image }) => {
  const [itemCount, setItemCount] = useState(0);

  // Si no hay imagen, usar la imagen por defecto
  const imageSrc = image || defaultImage;

  return (
    <div className='food-item'>
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
