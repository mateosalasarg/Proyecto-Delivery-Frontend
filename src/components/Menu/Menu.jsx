import React from 'react';
import './Menu.css';
import { menu_list } from '../../assets/assets';

const Menu = ({ category, setCategory }) => {

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  return (
    <div className='initial-menu' id='initial-menu'>
      <h1>Disfruta de nuestro menú</h1>
      <p className='initial-menu-text'>Elige tu plato favorito</p>
      <div className='initial-menu-list'>
        {menu_list.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCategoryChange(item.menu_name)}  // Llamamos a la función para cambiar la categoría
            className='initial-menu-list-item'
          >
            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt={item.menu_name} />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default Menu;
