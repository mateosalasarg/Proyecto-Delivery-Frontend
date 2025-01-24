import React, { useState, useContext } from 'react';
import './FoodItem.css';
import PropTypes from 'prop-types';
import defaultImage from '../../assets/default.png';
import { CartContext } from '../../context/CartContext';
import add_icon_green from '../../assets/add_icon_green.png';
import remove_icon_red from '../../assets/remove_icon_red.png';
import bowl from '../../assets/bowl.png';

const FoodItem = ({ id, name, price, description, image }) => {
  const { agregarAlCarrito, eliminarDelCarrito } = useContext(CartContext);
  const [itemCount, setItemCount] = useState(0);

  const imageSrc = image || defaultImage;

  const handleAddToCart = () => {
    const item = {
      id,
      nombre: name,
      precio: parseFloat(price),
      cantidad: 1,
    };
    agregarAlCarrito(item);
    setItemCount((prev) => prev + 1);
  };

  const handleRemoveFromCart = () => {
    eliminarDelCarrito(id);
    setItemCount((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={imageSrc} alt={name} />
        {!itemCount ? (
          <img
            className="add"
            onClick={handleAddToCart}
            src={bowl}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={handleRemoveFromCart}
              src={remove_icon_red}
              alt="Quitar"
            />
            <p>{itemCount}</p>
            <img onClick={handleAddToCart} src={add_icon_green} alt="Añadir" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-info-name">
          <p>{name}</p>
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

FoodItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
};

export default FoodItem;
