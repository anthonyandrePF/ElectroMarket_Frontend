import api from './api';

export const dashboardService = {
  getResumen: async () => {
    try {
      console.log('📡 Haciendo request a /dashboard/resumen');
      const response = await api.get('/dashboard/resumen');
      console.log('✅ Response de resumen:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en getResumen:', error);
      console.error('❌ Response error:', error.response);
      throw error;
    }
  },

  getVentasPorMes: async () => {
    try {
      console.log('📡 Haciendo request a /dashboard/ventas-por-mes');
      const response = await api.get('/dashboard/ventas-por-mes');
      console.log('✅ Response de ventas por mes:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en getVentasPorMes:', error);
      throw error;
    }
  },

  getVentasPorDia: async () => {
    try {
      console.log('📡 Haciendo request a /dashboard/ventas-por-dia');
      const response = await api.get('/dashboard/ventas-por-dia');
      console.log('✅ Response de ventas por día:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en getVentasPorDia:', error);
      throw error;
    }
  },

  getProductosMasVendidos: async () => {
    try {
      console.log('📡 Haciendo request a /dashboard/productos-mas-vendidos');
      const response = await api.get('/dashboard/productos-mas-vendidos');
      console.log('✅ Response de productos más vendidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en getProductosMasVendidos:', error);
      throw error;
    }
  }
};