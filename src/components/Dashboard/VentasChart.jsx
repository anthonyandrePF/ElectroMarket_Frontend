import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './VentasChart.css';

const VentasChart = ({ ventasPorMes, ventasPorDia }) => {
  const [chartType, setChartType] = useState('mes'); // 'mes' o 'dia'

  // Formatear datos para el gráfico de meses
  const dataMensual = ventasPorMes?.map(item => ({
    name: `Mes ${item.mes || item.numeroMes || 'N/A'}`,
    ventas: item.totalVentas || item.ingresos || 0,
    cantidad: item.cantidadVentas || item.totalTransacciones || 0
  })) || [];

  // Formatear datos para el gráfico de días (últimos 7 días)
  const dataDiaria = ventasPorDia?.slice(0, 7).map(item => ({
    name: item.fecha || `Día ${item.dia}`,
    ventas: item.totalVentas || item.ingresos || 0,
    cantidad: item.cantidadVentas || item.totalTransacciones || 0,
    productos: item.totalProductosVendidos || item.productosVendidos || 0
  })) || [];

  console.log('📈 Datos para gráfico mensual:', dataMensual);
  console.log('📈 Datos para gráfico diario:', dataDiaria);

  return (
    <div className="ventas-chart">
      <div className="chart-header">
        <h3>📊 Evolución de Ventas</h3>
        <div className="chart-controls">
          <button
            className={`chart-btn ${chartType === 'mes' ? 'active' : ''}`}
            onClick={() => setChartType('mes')}
          >
            Por Mes
          </button>
          <button
            className={`chart-btn ${chartType === 'dia' ? 'active' : ''}`}
            onClick={() => setChartType('dia')}
          >
            Últimos 7 Días
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        {chartType === 'mes' ? (
          dataMensual.length > 0 ? (
            <LineChart data={dataMensual}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.2)" />
              <XAxis dataKey="name" stroke="#aeeaff" />
              <YAxis stroke="#aeeaff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid rgba(0,255,255,0.3)',
                  borderRadius: '8px',
                  color: '#e0f7ff'
                }}
                formatter={(value) => [`S/. ${value.toLocaleString()}`, 'Ventas']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#00ffff"
                strokeWidth={3}
                name="Total Ventas (S/.)"
                dot={{ fill: '#00ffff', r: 5 }}
                activeDot={{ r: 7, fill: '#3B82F6' }}
              />
            </LineChart>
          ) : (
            <div className="no-data-chart">
              <p>No hay datos mensuales disponibles</p>
            </div>
          )
        ) : (
          dataDiaria.length > 0 ? (
            <BarChart data={dataDiaria}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,255,255,0.2)" />
              <XAxis dataKey="name" stroke="#aeeaff" />
              <YAxis stroke="#aeeaff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  border: '1px solid rgba(0,255,255,0.3)',
                  borderRadius: '8px',
                  color: '#e0f7ff'
                }}
                formatter={(value) => [`S/. ${value.toLocaleString()}`, 'Ventas']}
              />
              <Legend />
              <Bar
                dataKey="ventas"
                fill="url(#colorVentas)"
                name="Total Ventas (S/.)"
                barSize={40}
                radius={[8, 8, 0, 0]}
              />
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ffff" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.5} />
                </linearGradient>
              </defs>
            </BarChart>
          ) : (
            <div className="no-data-chart">
              <p>No hay datos diarios disponibles</p>
            </div>
          )
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default VentasChart;