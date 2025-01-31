**Delivery Nono** es una aplicación diseñada para gestionar los pedidos de una rotisería. El sistema incluye funcionalidades para clientes, repartidores y administradores, permitiendo realizar pedidos, gestionarlos y entregarlos de manera eficiente.

##  Características

- **Gestión de Clientes:** Registro, inicio de sesión y protección con contraseña.
- **Carrito de Compras:** Permite agregar, editar y eliminar platos antes de finalizar un pedido.
- **Gestión de Repartidores:** Página para crear, editar y visualizar repartidores.
- **Pedidos:** Visualización y seguimiento de pedidos en tiempo real.
- **Despliegue:** Frontend en Firebase Hosting y backend en PythonAnywhere.

## Tecnologías Utilizadas

- **Frontend:** React, Vite, CSS puro.
- **Backend:** Flask (Python).
- **Base de Datos:** MySQL.
- **Almacenamiento de Imágenes:** Firebase Storage.
- **Despliegue:**
  - Frontend: Firebase Hosting.
  - Backend: PythonAnywhere.

##  Estructura del Proyecto Front

```bash
src/
├── components/                    
│   ├── FoodItem/                  
│   ├── Header/                    
│   ├── Login/                     
│   ├── Menu/                     
│   ├── Nav/                       
│   ├── OrdenForm/                 
│   └── Plato/                     
├── context/                       
│   └── CartContext.jsx            
├── pages/                         
│   ├── Admin/                     
│   │   ├── StylesAdmin/           
│   │   ├── AdminCard.jsx          
│   │   ├── DashboardPage.jsx      
│   ├── Cart/                      
│   ├── Home/                      
│   │   ├── Home.css               
│   │   └── Home.jsx               
│   ├── Login/                     
│   │   ├── LoginCliente/          
│   │   │   ├── Login.jsx          
│   │   │   └── style.css          
│   │   ├── LoginRepartidor/       
│   │   │   └── DriverLogin.jsx    
│   ├── Order/                     
│   │   ├── OrderStatus.css        
│   │   └── OrderStatus.jsx        
│   ├── Repartidor/                
│   ├── Pedidos.jsx                
│   ├── Platos.jsx                 
│   └── Repartidor.jsx             
├── App.css                        
├── App.jsx                        
├── index.css                      
└── main.jsx                       
```

## Requerimientos

- Node.js 18.16.1+
- Vite 6.0.5+
- React 18.3.1+
- React Router 7.1.1+
- React Router DOM 7.1.1+

## Instalación

1. Instalar las dependencias

```bash
npm install
```

2. Iniciar el servidor de desarrollo

```bash
npm run dev
```
