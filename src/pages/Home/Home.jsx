import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import Menu from '../../components/Menu/Menu'
import Food from '../../components/Food/Food'
const Home = () => {
  const [category,setCategory] = useState('All');
  return (
    <div>
      <Header />
      <Menu category={category} setcategory={setCategory}/>
      <Food category={category}/>
    </div>
  )
}

export default Home
