import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPedidoId, setExpandedPedidoId] = useState(null); // Para manejar los pedidos expandibles
    const [platosDetalles, setPlatosDetalles] = useState({}); // Para almacenar detalles de cada plato

    useEffect(() => {
        // Hacer la solicitud a la API para obtener los pedidos
        const fetchPedidos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/pedidos');
                setPedidos(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los pedidos');
                setLoading(false);
            }
        };

        fetchPedidos();
    }, []);

    const fetchPlatoDetalles = async (id_plato) => {
        // Solo hacer la llamada si aún no se han cargado los detalles del plato
        if (!platosDetalles[id_plato]) {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/platos/${id_plato}`);
                setPlatosDetalles(prevState => ({
                    ...prevState,
                    [id_plato]: response.data
                }));
            } catch (err) {
                console.error('Error al cargar los detalles del plato', err);
            }
        }
    };

    const toggleDetalles = (id) => {
        // Cambia el estado de expandir un pedido
        setExpandedPedidoId(expandedPedidoId === id ? null : id);
    };

    useEffect(() => {
        // Si un pedido es expandido, cargar los detalles de los platos relacionados
        if (expandedPedidoId) {
            const pedido = pedidos.find(p => p.id_pedido === expandedPedidoId);
            pedido.detalles.forEach(detalle => {
                fetchPlatoDetalles(detalle.id_plato);
            });
        }
    }, [expandedPedidoId, pedidos]);

    if (loading) {
        return <div>Cargando pedidos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Pedidos</h1>
            <table>
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Comentario</th>
                        <th>Domicilio</th>
                        <th>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <React.Fragment key={pedido.id_pedido}>
                            <tr>
                                <td>{pedido.id_cliente}</td>
                                <td>{new Date(pedido.fecha_hora).toLocaleString()}</td>
                                <td>{pedido.estado}</td>
                                <td>{pedido.comentario}</td>
                                <td>{pedido.domicilio_entrega}</td>
                                <td>
                                    <button onClick={() => toggleDetalles(pedido.id_pedido)}>
                                        {expandedPedidoId === pedido.id_pedido ? 'Ocultar detalles' : 'Ver detalles'}
                                    </button>
                                </td>
                            </tr>
                            {expandedPedidoId === pedido.id_pedido && (
                                <tr>
                                    <td colSpan="6">
                                        <h3>Detalles del Pedido:</h3>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Cantidad</th>
                                                    <th>Comentario</th>
                                                    <th>Nombre del Plato</th>
                                                    <th>Precio</th>
                                                    <th>Disponible</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedido.detalles.map((detalle, index) => (
                                                    <tr key={index}>
                                                        <td>{detalle.cantidad}</td>
                                                        <td>{detalle.comentario}</td>
                                                        <td>
                                                            {/* La información del plato se carga directamente */}
                                                            {platosDetalles[detalle.id_plato] ? (
                                                                platosDetalles[detalle.id_plato].nombre
                                                            ) : (
                                                                <span>Cargando...</span> // Indicador de carga
                                                            )}
                                                        </td>
                                                        <td>
                                                            {platosDetalles[detalle.id_plato] ? (
                                                                platosDetalles[detalle.id_plato].precio
                                                            ) : (
                                                                <span>Cargando...</span> // Indicador de carga
                                                            )}
                                                        </td>
                                                        <td>
                                                            {platosDetalles[detalle.id_plato] ? (
                                                                platosDetalles[detalle.id_plato].disponible === 1 ? 'Disponible' : 'No disponible'
                                                            ) : (
                                                                <span>Cargando...</span> // Indicador de carga
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Pedidos;
