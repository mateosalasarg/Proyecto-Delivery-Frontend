import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Archivo de estilos globales
import App from './App.jsx'; // Componente raíz de la aplicación
import { BrowserRouter } from 'react-router-dom'; // Router para la navegación
import { CartProvider } from './context/CartContext'; // Importar el CartProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CartProvider>
      <App />
    </CartProvider>
  </BrowserRouter>
);
