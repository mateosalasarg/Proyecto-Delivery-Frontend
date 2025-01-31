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
src/
├── components/                    # Componentes reutilizables
│   ├── FoodItem/                  # Componente de los platos en el menú
│   ├── Header/                    # Componente del encabezado
│   ├── Login/                     # Componentes de login compartidos
│   ├── Menu/                      # Componente del menú principal
│   ├── Nav/                       # Navegación general
│   ├── OrdenForm/                 # Formulario para órdenes
│   └── Plato/                     # Componente para mostrar información del plato
├── context/                       # Contextos para manejo de estados globales
│   └── CartContext.jsx            # Contexto para manejar el carrito de compras
├── pages/                         # Páginas principales organizadas por funcionalidad
│   ├── Admin/                     # Páginas de administración
│   │   ├── StylesAdmin/           # Estilos específicos para la administración
│   │   ├── AdminCard.jsx          # Componente para tarjetas administrativas
│   │   ├── DashboardPage.jsx      # Página del tablero administrativo
│   │  
│   ├── Cart/                      # Página del carrito de compras
│   ├── Home/                      # Página de inicio
│   │   ├── Home.css               # Estilos específicos de Home
│   │   └── Home.jsx               # Componente principal de la página Home
│   ├── Login/                     # Página de inicio de sesión
│   │   ├── LoginCliente/          # Login para clientes
│   │   │   ├── Login.jsx
│   │   │   └── style.css
│   │   ├── LoginRepartidor/       # Login para repartidores
│   │   │   └── DriverLogin.jsx
│   ├── Order/                     # Página para gestión de pedidos
│   │   ├── OrderStatus.css        # Estilos específicos de los pedidos
│   │   └── OrderStatus.jsx        # Estado y detalles de los pedidos
│   ├── Repartidor/                # Página de repartidores
│   ├── Pedidos.jsx                # Página general de pedidos
│   ├── Platos.jsx                 # Página general de platos
│   └── Repartidor.jsx             # Página general de repartidores
├── App.css                        # Estilos globales
├── App.jsx                        # Componente principal
├── index.css                      # Estilos globales adicionales
└── main.jsx                       # Punto de entrada de la app