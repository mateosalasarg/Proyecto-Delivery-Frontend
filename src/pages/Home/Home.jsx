import React, { useState } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import Menu from '../../components/Menu/Menu';
import Food from '../../components/Food/Food';

const Home = () => {
    const [category, setCategory] = useState('All'); // Estado para las categorías

    return (
        <div>
            <Header />
            <Menu category={category} setCategory={setCategory} />
            <Food category={category} />
        </div>
    );
};

export default Home;
