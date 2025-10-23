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
          <MetricCard title="Ventas Hoy" value={resumen?.totalVentasHoy || 0} subtitle="transacciones" icon="🛒" color="#3B82F6" />
          <MetricCard title="Ingresos Hoy" value={`S/. ${(resumen?.ingresosHoy || 0).toLocaleString()}`} subtitle="total del día" icon="💰" color="#10B981" />
          <MetricCard title="Productos Vendidos Hoy" value={resumen?.totalProductosVendidosHoy || 0} subtitle="unidades" icon="📦" color="#F59E0B" />
          <MetricCard title="Ingresos del Mes" value={`S/. ${(resumen?.ingresosMes || 0).toLocaleString()}`} subtitle="total mensual" icon="📊" color="#8B5CF6" />
          <MetricCard title="Ventas del Mes" value={resumen?.totalVentasMes || 0} subtitle="transacciones" icon="📈" color="#EC4899" />
          <MetricCard title="Productos Bajo Stock" value={resumen?.productosBajoStock || 0} subtitle="necesitan reposición" icon="⚠️" color="#EF4444" />
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
