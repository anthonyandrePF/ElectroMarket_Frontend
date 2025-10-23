import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio de Productos
export const productoService = {
  getAll: () => api.get('/productos'),
  getById: (id) => api.get(`/productos/${id}`),
  getByCategory: (categoriaId) => api.get(`/productos/categoria/${categoriaId}`),
  getByMarca: (marcaId) => api.get(`/productos/marca/${marcaId}`),
  create: (producto) => api.post('/productos', producto),
  update: async (id, productoData) => {
    const response = await api.put(`/productos/${id}`, productoData);
    return response.data;
  },
  actualizarStock: async (id, stock) => {
    const response = await api.put(`/productos/${id}/stock`, { stock });
    return response.data;
  },
  delete: (id) => api.delete(`/productos/${id}`),
};

// Servicio de Imágenes de Producto
export const productoImagenService = {
  // Obtener imágenes de un producto
  getByProducto: (productoId) => api.get(`/producto-imagenes/producto/${productoId}`),
  
  // Agregar imagen a producto
  addImagen: (productoId, imagenData) => 
    api.post(`/producto-imagenes/producto/${productoId}/agregar`, imagenData),
  
  // Eliminar imagen específica
  deleteImagen: (imagenId) => api.delete(`/producto-imagenes/${imagenId}`),
  
  // Establecer como principal
  setPrincipal: (imagenId) => 
    api.put(`/producto-imagenes/${imagenId}/establecer-principal`),
  
  // Quitar principal
  removePrincipal: (productoId) => 
    api.put(`/producto-imagenes/producto/${productoId}/quitar-principal`)
};

// Servicio de Clientes
export const clienteService = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (cliente) => api.post('/clientes', cliente),
};

// Servicio de Ventas
export const ventaService = {
  getAll: () => api.get('/ventas'),
  create: (venta) => api.post('/ventas', venta),
};

export default api;