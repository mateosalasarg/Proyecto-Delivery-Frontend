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
