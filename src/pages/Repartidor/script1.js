document.addEventListener("DOMContentLoaded", () => {
  const orders = [
    {
      id: 1,
      clientName: "Carlos Gómez",
      address: "Avenida Siempre Viva 742",
      details: "2 pizzas grandes, 1 coca cola",
      status: "Pendiente",
    },
    {
      id: 2,
      clientName: "María López",
      address: "Calle Los Pinos 123",
      details: "1 hamburguesa con papas, 1 limonada",
      status: "Pendiente",
    },
  ];

  const ordersList = document.getElementById("orders-list");

  // Renderizar la lista de pedidos
  const renderOrders = () => {
    ordersList.innerHTML = "";
    orders.forEach((order) => {
      const orderItem = document.createElement("div");
      orderItem.className = `order-item ${
        order.status === "Entregado" ? "completed" : ""
      } ${order.status === "Rechazado" ? "rejected" : ""}`;
      orderItem.innerHTML = `
        <h3>Pedido #${order.id}</h3>
        <p><strong>Cliente:</strong> ${order.clientName}</p>
        <p><strong>Dirección:</strong> ${order.address}</p>
        <p><strong>Detalles:</strong> ${order.details}</p>
        <p><strong>Estado:</strong> ${order.status}</p>
        ${
          order.status === "Pendiente"
            ? `
              <button onclick="markAsDelivered(${order.id})">Marcar como Entregado</button>
              <button onclick="markAsRejected(${order.id})" class="reject-button">Rechazar Pedido</button>
            `
            : order.status === "Entregado"
            ? "<p class='completed-message'>Pedido Entregado</p>"
            : "<p class='rejected-message'>Pedido Rechazado</p>"
        }
      `;
      ordersList.appendChild(orderItem);
    });
  };

  // Marcar pedido como entregado
  window.markAsDelivered = (id) => {
    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex > -1) {
      orders[orderIndex].status = "Entregado";
      renderOrders();
      alert(`El pedido #${id} fue marcado como entregado.`);
    }
  };

  // Marcar pedido como rechazado
  window.markAsRejected = (id) => {
    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex > -1) {
      orders[orderIndex].status = "Rechazado";
      renderOrders();
      alert(`El pedido #${id} fue rechazado.`);
    }
  };

  // Renderizar los pedidos al cargar la página
  renderOrders();
});
