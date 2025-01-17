import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./StylesAdmin/Pedido.css"
const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPedidoId, setExpandedPedidoId] = useState(null);
    const [platosDetalles, setPlatosDetalles] = useState({});
    const [platosToModify, setPlatosToModify] = useState([]); // Mantener platos a modificar
    const [availablePlatos, setAvailablePlatos] = useState([]); // Platos disponibles
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal para agregar plato
    const [selectedPlato, setSelectedPlato] = useState(null); // Plato seleccionado para agregar

    useEffect(() => {
        // Obtener los pedidos
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

        // Obtener los platos disponibles
        const fetchAvailablePlatos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/platos?disponible=1');  // Filtrar platos disponibles
                setAvailablePlatos(response.data);
            } catch (err) {
                console.error('Error al cargar los platos disponibles', err);
            }
        };

        fetchPedidos();
        fetchAvailablePlatos();
    }, []);

    const toggleDetalles = (id) => {
        if (expandedPedidoId !== id) {
            setExpandedPedidoId(id);
            // Cargar detalles de los platos para este pedido
            const fetchPlatosDetalles = async () => {
                try {
                    const response = await axios.get('http://127.0.0.1:5000/platos');
                    const detalles = response.data.reduce((acc, plato) => {
                        acc[plato.id_plato] = plato;
                        return acc;
                    }, {});
                    setPlatosDetalles(detalles);
                } catch (err) {
                    console.error('Error al cargar los detalles de los platos', err);
                }
            };
            fetchPlatosDetalles();
        } else {
            setExpandedPedidoId(null);
            setPlatosDetalles({});
        }
    };

    // Función para agregar un plato al pedido
    const addPlatoToPedido = async (id_pedido) => {
        if (!selectedPlato) {
            alert('Por favor seleccione un plato');
            return;
        }

        try {
            await axios.put(`http://127.0.0.1:5000/pedidos/${id_pedido}/modify-platos`, {
                action: 'add',
                platos: [{
                    id_plato: selectedPlato.id_plato,
                    cantidad: 1,  // Personalizar cantidad si es necesario
                    comentario: 'Nuevo plato agregado'
                }]
            });

            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.id_pedido === id_pedido
                        ? {
                            ...pedido,
                            detalles: [
                                ...pedido.detalles,
                                {
                                    id_plato: selectedPlato.id_plato,
                                    cantidad: 1,  // Personalizar cantidad si es necesario
                                    comentario: 'Nuevo plato agregado'
                                }
                            ]
                        }
                        : pedido
                )
            );

            setIsModalOpen(false);  // Cerrar modal después de agregar
            setSelectedPlato(null);  // Limpiar selección
            alert('Plato agregado con éxito');
        } catch (err) {
            console.error('Error al agregar el plato:', err);
            alert('Error al agregar el plato');
        }
    };

    // Función para eliminar platos del pedido
    const removePlatoFromPedido = async (id_pedido, id_plato) => {
        try {
            await axios.put(`http://127.0.0.1:5000/pedidos/${id_pedido}/modify-platos`, {
                action: 'remove',
                platos: [{
                    id_plato,
                    cantidad: 1 // Puedes ajustar la cantidad si es necesario
                }]
            });

            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.id_pedido === id_pedido
                        ? {
                            ...pedido,
                            detalles: pedido.detalles.filter(detalle => detalle.id_plato !== id_plato) // Eliminar el plato de los detalles
                        }
                        : pedido
                )
            );

            alert('Plato eliminado con éxito');
        } catch (err) {
            console.error('Error al eliminar el plato:', err);
            alert('Error al eliminar el plato');
        }
    };

    if (loading) return <div>Cargando pedidos...</div>;
    if (error) return <div>{error}</div>;

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
                                    <button onClick={() => setIsModalOpen(true)}>Agregar Plato</button> {/* Botón para abrir modal */}
                                </td>
                            </tr>

                            {/* Modal para agregar plato */}
                            {isModalOpen && (
                                <div className="modal">
                                    <div className="modal-content">
                                        <h3>Seleccionar Plato para agregar</h3>
                                        <select onChange={(e) => setSelectedPlato(JSON.parse(e.target.value))} value={selectedPlato ? JSON.stringify(selectedPlato) : ''}>
                                            <option value="">Seleccionar Plato</option>
                                            {availablePlatos.map(plato => (
                                                <option key={plato.id_plato} value={JSON.stringify(plato)}>
                                                    {plato.nombre} - ${plato.precio} - {plato.disponible === 1 ? 'Disponible' : 'No disponible'}
                                                </option>
                                            ))}
                                        </select>
                                        <br />
                                        <button onClick={() => addPlatoToPedido(pedido.id_pedido)}>Agregar Plato</button>
                                        <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
                                    </div>
                                </div>
                            )}

                            {/* Detalles del Pedido */}
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
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedido.detalles.map((detalle) => (
                                                    <tr key={detalle.id_pedido_detalle}>
                                                        <td>{detalle.cantidad}</td>
                                                        <td>{detalle.comentario}</td>
                                                        <td>{platosDetalles[detalle.id_plato] ? platosDetalles[detalle.id_plato].nombre : 'Cargando...'}</td>
                                                        <td>{platosDetalles[detalle.id_plato] ? platosDetalles[detalle.id_plato].precio : 'Cargando...'}</td>
                                                        <td>{platosDetalles[detalle.id_plato] ? (platosDetalles[detalle.id_plato].disponible === 1 ? 'Disponible' : 'No disponible') : 'Cargando...'}</td>
                                                        <td>
                                                            <button onClick={() => removePlatoFromPedido(pedido.id_pedido, detalle.id_plato)}>Eliminar Plato</button>
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
