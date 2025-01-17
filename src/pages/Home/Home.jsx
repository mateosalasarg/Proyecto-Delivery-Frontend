import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import Food from '../../components/Food/Food';  // Este es el componente donde se muestran los platos

const Home = () => {
  const [category, setCategory] = useState(''); // Estado para las categorías, vacío por defecto

  return (
    <div>
      <Header />
      {/* Pasamos `category` y `setCategory` al componente Menu */}
      <Menu category={category} setCategory={setCategory} />
      {/* Pasamos `category` al componente Food, que se encarga de mostrar los platos */}
      <Food category={category} />
    </div>
  );
};

export default Home;
