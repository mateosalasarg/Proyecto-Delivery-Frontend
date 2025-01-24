import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);
  
    const agregarAlCarrito = (item) => {
      setCarrito((prev) => {
        const itemExistente = prev.find((producto) => producto.id === item.id);
        if (itemExistente) {
          return prev.map((producto) =>
            producto.id === item.id
              ? { ...producto, cantidad: producto.cantidad + item.cantidad }
              : producto
          );
        } else {
          return [...prev, item];
        }
      });
    };
  
    const eliminarDelCarrito = (id) => {
      setCarrito((prev) =>
        prev
          .map((producto) =>
            producto.id === id
              ? { ...producto, cantidad: producto.cantidad - 1 }
              : producto
          )
          .filter((producto) => producto.cantidad > 0) // Eliminar productos con cantidad 0
      );
    };
  
    return (
      <CartContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito }}>
        {children}
      </CartContext.Provider>
    );
  };
  