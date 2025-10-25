import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import MetricCard from './MetricCard';
import VentasChart from './VentasChart';
import ProductosTable from './ProductosTable';
import './Dashboard.css';

const Dashboard = () => {
  const [resumen, setResumen] = useState(null);
  const [ventasPorMes, setVentasPorMes] = useState([]);
  const [ventasPorDia, setVentasPorDia] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          resumenData,
          ventasMesData,
          ventasDiaData,
          productosData
        ] = await Promise.all([
          dashboardService.getResumen(),
          dashboardService.getVentasPorMes(),
          dashboardService.getVentasPorDia(),
          dashboardService.getProductosMasVendidos()
        ]);

        console.log('📊 RESUMEN:', resumenData);
        console.log('📊 VENTAS POR DÍA:', ventasDiaData);
        console.log('📊 PRODUCTOS MÁS VENDIDOS:', productosData);

        setResumen(resumenData);
        setVentasPorMes(ventasMesData);
        setVentasPorDia(ventasDiaData);
        setProductosMasVendidos(productosData);
      } catch (err) {
        console.error('❌ Error al cargar dashboard:', err);
        setError('Error al cargar los datos del dashboard: ' + (err.message || 'Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Opción alternativa - Usar la fecha más reciente como "hoy"
  const calcularMetricas = () => {
    if (!resumen) return {};

    // Usar la fecha más reciente de ventasPorDia como "hoy"
    const fechaMasReciente = ventasPorDia?.[0]?.fecha;
    const ventaHoy = ventasPorDia?.find(venta => venta.fecha === fechaMasReciente);
    
    console.log('🔍 Fecha más reciente en datos:', fechaMasReciente);
    console.log('🛒 Venta de hoy (fecha más reciente):', ventaHoy);

    const productosVendidosHoy = ventaHoy?.totalProductosVendidos || 0;

    return {
      ventasHoy: resumen.ventasHoy || 0,
      ingresosHoy: resumen.ingresosHoy || 0,
      productosVendidosHoy: productosVendidosHoy,
      ingresosMes: ventasPorMes?.reduce((total, mes) => total + (mes.totalVentas || 0), 0) || 0,
      ventasMes: ventasPorMes?.reduce((total, mes) => total + (mes.cantidadVentas || 0), 0) || 0,
      productosBajoStock: resumen.productosBajoStock || 0
    };
  };

  const metricas = calcularMetricas();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h2>📊 Dashboard de Ventas</h2>
          <p>Resumen general de las métricas y desempeño</p>
        </header>

        <section className="metrics-grid">
          <MetricCard 
            title="VENTAS HOY" 
            value={metricas.ventasHoy} 
            subtitle="transacciones" 
            icon="🛒" 
            color="#3B82F6" 
          />
          <MetricCard 
            title="INGRESOS HOY" 
            value={`S/. ${(metricas.ingresosHoy || 0).toLocaleString()}`} 
            subtitle="total del día" 
            icon="💰" 
            color="#10B981" 
          />
          <MetricCard 
            title="PRODUCTOS VENDIDOS HOY" 
            value={metricas.productosVendidosHoy} 
            subtitle="unidades" 
            icon="📦" 
            color="#F59E0B" 
          />
          <MetricCard 
            title="INGRESOS DEL MES" 
            value={`S/. ${(metricas.ingresosMes || 0).toLocaleString()}`} 
            subtitle="total mensual" 
            icon="📊" 
            color="#8B5CF6" 
          />
          <MetricCard 
            title="VENTAS DEL MES" 
            value={metricas.ventasMes} 
            subtitle="transacciones" 
            icon="📈" 
            color="#EC4899" 
          />
          <MetricCard 
            title="PRODUCTOS BAJO STOCK" 
            value={metricas.productosBajoStock} 
            subtitle="necesitan reposición" 
            icon="⚠️" 
            color="#EF4444" 
          />
        </section>

        <section className="charts-section">
          <div className="chart-container">
            <VentasChart ventasPorMes={ventasPorMes} ventasPorDia={ventasPorDia} />
          </div>
          <div className="table-container">
            <ProductosTable productos={productosMasVendidos} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;