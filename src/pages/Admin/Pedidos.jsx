import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./StylesAdmin/Pedido.css";

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPedidoId, setExpandedPedidoId] = useState(null);
    const [platosDetalles, setPlatosDetalles] = useState({});
    const [availablePlatos, setAvailablePlatos] = useState([]);
    const [isAgregarPlatoModalOpen, setIsAgregarPlatoModalOpen] = useState(false);
    const [selectedPlato, setSelectedPlato] = useState(null);
    const [updateField, setUpdateField] = useState('');
    const [updateValue, setUpdateValue] = useState('');
    const [repartidores, setRepartidores] = useState([]);
    const [repartidoresCargados, setRepartidoresCargados] = useState({});
    const [isClienteModalOpen, setIsClienteModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);


    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get('https://deliverynono.pythonanywhere.com/pedidos');
                setPedidos(response.data);
            } catch (err) {
                setError('Error al cargar los pedidos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        const fetchRepartidores = async () => {
            try {
                const response = await axios.get('https://deliverynono.pythonanywhere.com/repartidores/disponibles');
                setRepartidores(response.data);
            } catch (err) {
                console.error('Error al cargar los repartidores', err);
            }
        };
        fetchPedidos();
        fetchRepartidores();

            // Configurar recarga automática cada 3 minutos (180,000 ms)
            const interval = setInterval(fetchPedidos, 180000);    
            // Limpiar el intervalo al desmontar el componente

        return () => clearInterval(interval);
    }, []);
    const loadRepartidor = async (pedidoId, idRepartidor) => {
        if (!idRepartidor) {
            setRepartidoresCargados(prevState => ({
                ...prevState,
                [idRepartidor]: 'No asignado',
            }));
            return;
        }

        if (!repartidoresCargados[idRepartidor]) {
            try {
                const repartidorResponse = await axios.get(`https://deliverynono.pythonanywhere.com/repartidores/${idRepartidor}`);
                setRepartidoresCargados(prevState => ({
                    ...prevState,
                    [idRepartidor]: repartidorResponse.data?.nombre || 'Desconocido',
                }));
            } catch (err) {
                console.error(`Error al cargar el repartidor para el pedido con ID ${pedidoId}`, err);
                setRepartidoresCargados(prevState => ({
                    ...prevState,
                    [idRepartidor]: 'Error al cargar',
                }));
            }
        }
    };

    const toggleDetalles = async (id) => {
        if (expandedPedidoId !== id) {
            setExpandedPedidoId(id);
            const pedido = pedidos.find(pedido => pedido.id_pedido === id);

            if (pedido) {
                if (pedido.id_repartidor) {
                    loadRepartidor(id, pedido.id_repartidor);
                } else {
                    setRepartidoresCargados(prevState => ({
                        ...prevState,
                        [pedido.id_repartidor]: 'No asignado',
                    }));
                }
            }

            // Cargar detalles de los platos solo si no están cargados
            if (Object.keys(platosDetalles).length === 0) {
                try {
                    const response = await axios.get('https://deliverynono.pythonanywhere.com/platos');
                    const detalles = response.data.reduce((acc, plato) => {
                        acc[plato.id_plato] = plato;
                        return acc;
                    }, {});
                    setPlatosDetalles(detalles);
                } catch (err) {
                    console.error('Error al cargar los detalles de los platos', err);
                }
            }

            // Cargar platos disponibles solo si no están cargados
            if (availablePlatos.length === 0) {
                try {
                    const response = await axios.get('https://deliverynono.pythonanywhere.com/platos?disponible=1');
                    setAvailablePlatos(response.data);
                } catch (err) {
                    console.error('Error al cargar los platos disponibles', err);
                }
            }
        } else {
            setExpandedPedidoId(null);
            setPlatosDetalles({});
        }
    };    const addPlatoToPedido = async (id_pedido) => {
        if (!selectedPlato) {
            alert('Por favor seleccione un plato');
            return;
        }

        try {
            const pedidoId = typeof id_pedido === 'object' ? id_pedido.id : id_pedido;
            await axios.put(`https://deliverynono.pythonanywhere.com/pedidos/${pedidoId}/modify-platos`, {
                action: 'add',
                platos: [{
                    id_plato: selectedPlato.id_plato,
                    cantidad: 1,
                    comentario: 'Nuevo plato agregado'
                }]
            });

            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.id_pedido === pedidoId
                        ? {
                            ...pedido,
                            detalles: [
                                ...pedido.detalles,
                                {
                                    id_plato: selectedPlato.id_plato,
                                    cantidad: 1,
                                    comentario: 'Nuevo plato agregado'
                                }
                            ]
                        }
                        : pedido
                )
            );

            setIsAgregarPlatoModalOpen(false);
            setSelectedPlato(null);
            alert('Plato agregado con éxito');
        } catch (err) {
            console.error('Error al agregar el plato:', err);
            alert('Error al agregar el plato');
        }
    };

    const removePlatoFromPedido = async (id_pedido, id_plato) => {
        try {
            await axios.put(`https://deliverynono.pythonanywhere.com/pedidos/${id_pedido}/modify-platos`, {
                action: 'remove',
                platos: [{
                    id_plato,
                    cantidad: 1
                }]
            });

            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.id_pedido === id_pedido
                        ? {
                            ...pedido,
                            detalles: pedido.detalles.filter(detalle => detalle.id_plato !== id_plato)
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

    const updatePedido = async (id_pedido) => {
        if (!updateField || !updateValue) {
            alert('Por favor seleccione un campo y proporcione un valor.');
            return;
        }
        console.log(updateField,updateValue)

        let valorFinal = updateValue;
        if (updateField === 'pagado') {
            valorFinal = updateValue === 'Pagado' ? 1 : 2;
        }

        try {
            await axios.put(`https://deliverynono.pythonanywhere.com/pedidos/${id_pedido}`, {
                field: updateField,
                value: valorFinal,
            });

            setPedidos((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.id_pedido === id_pedido
                        ? { ...pedido, [updateField]: valorFinal }
                        : pedido
                )
            );

            alert('Pedido actualizado con éxito.');
            setUpdateField('');
            setUpdateValue('');
        } catch (err) {
            console.error('Error al actualizar el pedido:', err);
            alert('Error al actualizar el pedido.');
        }
    };



    const fetchClienteInfo = async (id_cliente) => {
        try {
            const response = await axios.get(`https://deliverynono.pythonanywhere.com/clientes/${id_cliente}`);
            console.log(response.data)
            setSelectedCliente(response.data);
            setIsClienteModalOpen(true);
        } catch (err) {
            console.error(`Error al cargar la información del cliente con ID ${id_cliente}`, err);
            alert('No se pudo cargar la información del cliente.');
        }
    };

    const getClassByEstado = (estado) => {
        switch (estado) {
            case 'Pendiente':
                return 'estado-pendiente';
            case 'En camino':
                return 'estado-en-camino';
            case 'Rechazado':
                return 'estado-rechazado';
            case 'Entregado':
                return 'estado-entregado';
            default:
                return '';
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
                        <th>Pagado</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <React.Fragment key={pedido.id_pedido}>
                            <tr className={getClassByEstado(pedido.estado)}>
                                <td>
                                    <button onClick={() => fetchClienteInfo(pedido.id_cliente)}>
                                        Info del Cliente
                                    </button>
                                </td>
                                <td>{new Date(pedido.fecha_hora).toLocaleString()}</td>
                                <td>{pedido.estado}</td>
                                <td>{pedido.comentario}</td>
                                <td>{pedido.domicilio_entrega}</td>
                                <td>
                                    <button onClick={() => toggleDetalles(pedido.id_pedido)}>
                                        {expandedPedidoId === pedido.id_pedido ? 'Ocultar detalles' : 'Ver detalles'}
                                    </button>
                                    <button onClick={() => setIsAgregarPlatoModalOpen(true)}>Agregar Plato</button>
                                </td>
                                <td>
                                    {Number(pedido.pagado) === 1 ? "Pagado" : "No pagado"}
                                </td>
                            </tr>
    
                            {expandedPedidoId === pedido.id_pedido && (
                                <tr>
                                    <td colSpan="7">
                                        <h3>Detalles del Pedido:</h3>
                                        <p>Repartidor: {repartidoresCargados[pedido.id_repartidor] || 'Cargando...'}</p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Cantidad</th>
                                                    <th>Comentario</th>
                                                    <th>Nombre del Plato</th>
                                                    <th>Precio</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pedido.detalles.map((detalle) => (
                                                    <tr key={detalle.id_pedido_detalle}>
                                                        <td>{detalle.cantidad}</td>
                                                        <td>{detalle.comentario}</td>
                                                        <td>{platosDetalles[detalle.id_plato]?.nombre || 'Cargando...'}</td>
                                                        <td>{platosDetalles[detalle.id_plato]?.precio || 'Cargando...'}</td>
                                                        <td>
                                                            <button onClick={() => removePlatoFromPedido(pedido.id_pedido, detalle.id_plato)}>Eliminar Plato</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
    
                                        <h3>Actualizar Pedido</h3>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                updatePedido(pedido.id_pedido);
                                            }}
                                        >
                                            <label htmlFor={`field-${pedido.id_pedido}`}>Campo:</label>
                                            <select
                                                id={`field-${pedido.id_pedido}`}
                                                value={updateField}
                                                onChange={(e) => setUpdateField(e.target.value)}
                                            >
                                                <option value="">Seleccionar campo</option>
                                                <option value="estado">Estado</option>
                                                <option value="comentario">Comentario</option>
                                                <option value="id_repartidor">Repartidor</option>
                                                <option value="pagado">Pagado</option>
                                            </select>
    
                                            <label htmlFor={`value-${pedido.id_pedido}`}>Nuevo Valor:</label>
                                            {updateField === 'id_repartidor' ? (
                                                <select
                                                    id={`value-${pedido.id_pedido}`}
                                                    value={updateValue}
                                                    onChange={(e) => setUpdateValue(e.target.value)}
                                                >
                                                    <option value="">Seleccionar repartidor</option>
                                                    {repartidores.map((repartidor) => (
                                                        <option key={repartidor.id_repartidor} value={repartidor.id_repartidor}>
                                                            {repartidor.nombre}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : updateField === 'pagado' ? (
                                                <select
                                                    id={`value-${pedido.id_pedido}`}
                                                    value={updateValue}
                                                    onChange={(e) => setUpdateValue(e.target.value)}
                                                >
                                                    <option value="">...</option>
                                                    <option value="Pagado">Pagado</option>
                                                    <option value="No pagado">No pagado</option>
                                                </select>
                                            ) : updateField === 'estado' ? (
                                                <select
                                                    id={`value-${pedido.id_pedido}`}
                                                    value={updateValue}
                                                    onChange={(e) => setUpdateValue(e.target.value)}
                                                >
                                                    <option value="">Seleccionar estado</option>
                                                    <option value="Pendiente">Pendiente</option>
                                                    <option value="En camino">En camino</option>
                                                    <option value="Rechazado">Rechazado</option>
                                                    <option value="Entregado">Entregado</option>
                                                </select>
                                            ) : (
                                                <input
                                                    id={`value-${pedido.id_pedido}`}
                                                    type="text"
                                                    value={updateValue}
                                                    onChange={(e) => setUpdateValue(e.target.value)}
                                                />
                                            )}
    
                                            <button type="submit">Actualizar</button>
                                        </form>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
    
            {/* Modal para agregar plato */}
            {isAgregarPlatoModalOpen && (
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
                        <button onClick={() => addPlatoToPedido(expandedPedidoId)}>Agregar Plato</button>
                        <button onClick={() => setIsAgregarPlatoModalOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}
    
            {/* Modal para información del cliente */}
            {isClienteModalOpen && selectedCliente && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Información del Cliente</h3>
                        <p><strong>Nombre:</strong> {selectedCliente.nombre}</p>
                        <p><strong>Email:</strong> {selectedCliente.correo}</p>
                        <p><strong>Teléfono:</strong> {selectedCliente.telefono}</p>
                        <p><strong>Dirección:</strong> {selectedCliente.domicilio}</p>
                        <button onClick={() => setIsClienteModalOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pedidos;
