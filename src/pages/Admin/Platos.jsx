import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Platos = () => {
    const [platos, setPlatos] = useState([]); // Para almacenar los platos
    const [loading, setLoading] = useState(false); // Para mostrar el estado de carga
    const [error, setError] = useState(null); // Para manejar errores
    const [editPlato, setEditPlato] = useState(null); // Plato que se va a editar
    const [field, setField] = useState(''); // Campo a actualizar
    const [value, setValue] = useState(''); // Valor del campo a actualizar
    const [newPlato, setNewPlato] = useState({ // Datos del nuevo plato
        nombre: '',
        descripcion: '',
        precio: '',
        disponible: 1,
        tipo_plato: ''
    });
    const [showCreateForm, setShowCreateForm] = useState(false); // Estado para mostrar el formulario de creación

    // Función para obtener los platos desde la API
    const fetchPlatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://127.0.0.1:5000/platos');
            setPlatos(response.data); // Guarda los platos en el estado
        } catch (err) {
            setError('Error al cargar los platos');
        } finally {
            setLoading(false);
        }
    };

    // Función para actualizar un plato
    const updatePlato = async (id_plato) => {
        if (!field || !value) {
            alert('Por favor ingrese un campo y un valor');
            return;
        }

        try {
            await axios.put(`http://127.0.0.1:5000/platos/${id_plato}`, {
                field: field,
                value: value
            });
            fetchPlatos(); // Refrescar la lista de platos
            setEditPlato(null); // Cerrar el formulario de edición
            alert('Plato actualizado con éxito');
        } catch (err) {
            console.error('Error al actualizar el plato:', err);
            alert('Error al actualizar el plato');
        }
    };

    const createPlato = async () => {
        const { nombre, descripcion, precio, disponible, tipo_plato } = newPlato;
    
        console.log('Datos enviados a la API:', newPlato);
    
        // Validación de campos
        if (!nombre || !precio || !tipo_plato) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }
    
        try {
            // Asegurarse de que 'precio' sea un número
            const updatedPlato = {
                ...newPlato,
                precio: parseFloat(precio), // Convertir precio a número
                tipo_plato: parseInt(tipo_plato), // Asegurarse de que 'tipo_plato' sea un número
                disponible: disponible === 1,  // Convertir 'disponible' a booleano
            };
    
            const response = await axios.post('http://127.0.0.1:5000/platos/crear', updatedPlato);
            alert(response.data.message);
            setShowCreateForm(false); // Cerrar formulario después de la creación
            fetchPlatos(); // Refrescar la lista de platos
            setNewPlato({ nombre: '', descripcion: '', precio: '', disponible: 1, tipo_plato: '' }); // Limpiar el formulario
        } catch (err) {
            console.error('Error al crear el plato:', err.response ? err.response.data : err.message);
            alert('Error al crear el plato');
        }
    };
    
    // Llamamos a la función para cargar los platos en el useEffect
    useEffect(() => {
        fetchPlatos();
    }, []);

    return (
        <div>
            <h1>Platos</h1>
            <p>Lista de todos los platos disponibles:</p>

            {/* Estado de carga o error */}
            {loading && <p>Cargando platos...</p>}
            {error && <p>{error}</p>}

            {/* Mostrar los platos si están disponibles */}
            {platos.length > 0 ? (
                <div>
                    <ul>
                        {platos.map((plato) => (
                            <li key={plato.id_plato}>
                                <h3>{plato.nombre}</h3>
                                <p>{plato.descripcion || 'Sin descripción'}</p>
                                <p>Precio: ${plato.precio}</p>
                                <p>{plato.disponible === 1 ? 'Disponible' : 'No disponible'}</p>

                                {/* Botón para editar plato */}
                                <button onClick={() => setEditPlato(plato.id_plato)}>Editar</button>

                                {/* Formulario de edición */}
                                {editPlato === plato.id_plato && (
                                    <div>
                                        <h4>Editar Plato</h4>
                                        <label>
                                            Campo:
                                            <select onChange={(e) => setField(e.target.value)} value={field}>
                                                <option value="">Seleccionar campo</option>
                                                <option value="nombre">Nombre</option>
                                                <option value="descripcion">Descripción</option>
                                                <option value="precio">Precio</option>
                                                <option value="disponible">Disponible</option>
                                                <option value="tipo_plato">Tipo de Plato</option>
                                            </select>
                                        </label>
                                        <br />
                                        <label>
                                            Valor:
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                            />
                                        </label>
                                        <br />
                                        <button onClick={() => updatePlato(plato.id_plato)}>Actualizar Plato</button>
                                        <button onClick={() => setEditPlato(null)}>Cancelar</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No hay platos disponibles.</p>
            )}

            {/* Botón para mostrar el formulario de creación */}
            <button onClick={() => setShowCreateForm(true)}>Crear Nuevo Plato</button>

            {/* Formulario para crear un nuevo plato */}
            {showCreateForm && (
                <div>
                    <h4>Crear Nuevo Plato</h4>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            value={newPlato.nombre}
                            onChange={(e) => setNewPlato({ ...newPlato, nombre: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Descripción:
                        <input
                            type="text"
                            value={newPlato.descripcion}
                            onChange={(e) => setNewPlato({ ...newPlato, descripcion: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Precio:
                        <input
                            type="number"
                            value={newPlato.precio}
                            onChange={(e) => setNewPlato({ ...newPlato, precio: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        Disponible:
                        <select
                            value={newPlato.disponible} // Aseguramos que sea número
                            onChange={(e) => setNewPlato({ ...newPlato, disponible: parseInt(e.target.value) })}
                        >
                            <option value="1">Sí</option>
                            <option value="2">No</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Tipo de Plato:
                        <select
                            value={newPlato.tipo_plato} // Aseguramos que sea número
                            onChange={(e) => setNewPlato({ ...newPlato, tipo_plato: parseInt(e.target.value) })}
                        >
                            <option value="">Seleccionar tipo</option>
                            <option value="1">No es Combo</option>
                            <option value="2">Combo</option>
                        </select>
                    </label>
                    <br />
                    <button onClick={createPlato}>Crear Plato</button>
                    <button onClick={() => setShowCreateForm(false)}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default Platos;
