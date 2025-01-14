import React from 'react'
import { Routes} from 'react-router-dom'
import {Route} from 'react-router-dom'
import Nav from './components/Nav/Nav'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import Order from './pages/Order/Order'
//import Header from './components/Header/Header'

const App = () => {
  return (
    <div className='App'>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<Order />} />
      </Routes>
    </div>
  )
}

// Agregar validación para 'children' en las props del componente
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // Valida que 'children' sea un nodo React
};

function App() {
    return (
        <AuthProvider>  {/* Envuelve toda la app con AuthProvider */}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route 
                    path="/home" 
                    element={
                        <ProtectedRoute>
                            <Home />  {/* Solo se renderiza si está autenticado */}
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
