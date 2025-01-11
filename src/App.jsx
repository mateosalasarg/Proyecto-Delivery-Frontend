import React from 'react'
import { Routes} from 'react-router-dom'
import {Route} from 'react-router-dom'
import Nav from './components/Nav/Nav'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import Order from './pages/Order/Order'
import Header from './components/Header/Header'

const App = () => {
  return (
    <div className='App'>
      <Nav />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<Order />} />
      </Routes>
    </div>
  )
}

export default App

