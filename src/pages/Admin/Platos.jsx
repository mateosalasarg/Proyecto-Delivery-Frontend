import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StylesAdmin/Platos.css';

const Platos = () => {
    const [platos, setPlatos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newPlato, setNewPlato] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        disponible: 1,
        tipo_plato: 1,
        imagen: '',
        categoria: ''
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editPlato, setEditPlato] = useState(null);
    const [field, setField] = useState('');
    const [value, setValue] = useState('');

    const categorias = [
        'Promociones',
        'Sandwiches',
        'Empanadas',
        'Pizzas',
        'Hamburguesas',
        'Platos',
        'Postres',
        'Bebidas'
    ];

    const fetchPlatos = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://127.0.0.1:5000/platos');
            setPlatos(response.data);
        } catch (err) {
            setError('Error al cargar los platos');
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post('http://127.0.0.1:5000/imagen', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const fileName = response.data.fileName;
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/delivery-nono-7dc3c.firebasestorage.app/o/${encodeURIComponent(fileName)}?alt=media`;
            return imageUrl;
        } catch (err) {
            console.error('Error al subir la imagen:', err);
            alert('Error al subir la imagen');
            return '';
        }
    };

    const createPlato = async () => {
        const { nombre, descripcion, precio, disponible, tipo_plato, imagen, categoria } = newPlato;

        if (!nombre || !precio || !tipo_plato || !categoria) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        try {
            let uploadedImage = imagen;
            if (imagen instanceof File) {
                uploadedImage = await uploadImage(imagen);
                if (!uploadedImage) return;
            }

            const updatedPlato = {
                ...newPlato,
                precio: parseFloat(precio),
                tipo_plato: parseInt(tipo_plato),
                disponible: disponible === 1,
                imagen: uploadedImage
            };

            const response = await axios.post('http://127.0.0.1:5000/platos/crear', updatedPlato);
            alert(response.data.message);
            setShowCreateForm(false);
            fetchPlatos();
            setNewPlato({ nombre: '', descripcion: '', precio: '', disponible: 1, tipo_plato: 1, imagen: '', categoria: '' });
        } catch (err) {
            console.error('Error al crear el plato:', err.response ? err.response.data : err.message);
            alert('Error al crear el plato');
        }
    };

    const updatePlato = async (id_plato) => {
        if (!field || !value) {
            alert('Por favor ingrese un campo y un valor');
            return;
        }

        try {
            await axios.put(`http://127.0.0.1:5000/platos/${id_plato}`, { field, value });
            fetchPlatos();
            setEditPlato(null);
            alert('Plato actualizado con éxito');
        } catch (err) {
            console.error('Error al actualizar el plato:', err);
            alert('Error al actualizar el plato');
        }
    };

    useEffect(() => {
        fetchPlatos();
    }, []);

    return (
        <div className="platos-container">
            <h1>Platos</h1>
            {loading && <p>Cargando platos...</p>}
            {error && <p>{error}</p>}

            <div className="platos-list">
                <ul>
                    {platos.map((plato) => (
                        <li key={plato.id_plato}>
                            <h3>{plato.nombre}</h3>
                            <p>{plato.descripcion || 'Sin descripción'}</p>
                            <p>Precio: ${plato.precio}</p>
                            <p>{plato.disponible === 1 ? 'Disponible' : 'No disponible'}</p>
                            <p>Categoría: {plato.categoria}</p>
                            {plato.imagen && <img src={plato.imagen} alt={plato.nombre} width="100" />}
                            <div className="platos-buttons">
                                <button onClick={() => setEditPlato(plato.id_plato)}>Editar</button>
                            </div>

                            {editPlato === plato.id_plato && (
                                <div className="platos-edit-modal">
                                    <div className="modal-content">
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
                                                <option value="categoria">Categoría</option>
                                            </select>
                                        </label>
                                        <br />
                                        <label>
                                            Valor:
                                            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
                                        </label>
                                        <br />
                                        <button onClick={() => updatePlato(plato.id_plato)}>Actualizar Plato</button>
                                        <button onClick={() => setEditPlato(null)}>Cancelar</button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="platos-buttons">
                <button onClick={() => setShowCreateForm(true)}>Crear Nuevo Plato</button>
            </div>

            {showCreateForm && (
                <div className="platos-form">
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
                            value={newPlato.disponible}
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
                            value={newPlato.tipo_plato}
                            onChange={(e) => setNewPlato({ ...newPlato, tipo_plato: parseInt(e.target.value) })}
                        >
                            <option value="1">No es Combo</option>
                            <option value="2">Combo</option>
                        </select>
                    </label>
                    <br />
                    <label>
                        Categoría:
                        <select
                            value={newPlato.categoria}
                            onChange={(e) => setNewPlato({ ...newPlato, categoria: e.target.value })}
                        >
                            <option value="">Seleccionar Categoría</option>
                            {categorias.map((categoria, index) => (
                                <option key={index} value={categoria}>{categoria}</option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label>
                        Imagen:
                        <input
                            type="file"
                            onChange={(e) => setNewPlato({ ...newPlato, imagen: e.target.files[0] })}
                        />
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
