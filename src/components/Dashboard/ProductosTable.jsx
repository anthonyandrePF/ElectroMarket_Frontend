import React from 'react';
import './ProductosTable.css';

const ProductosTable = ({ productos }) => {
  if (!productos || productos.length === 0) {
    return (
      <div className="productos-table">
        <h3>📦 Productos Más Vendidos</h3>
        <p>No hay datos disponibles actualmente</p>
      </div>
    );
  }

  return (
    <div className="productos-table">
      <h3>📊 Top 10 Productos Más Vendidos</h3>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Unidades Vendidas</th>
              <th>Ingresos Totales</th>
            </tr>
          </thead>

          <tbody>
            {productos.map((producto, index) => (
              <tr key={producto.idProducto || index}>
                <td className="rank">{index + 1}</td>
                <td className="product-name">
                  <span className="neon-text">
                    {producto.nombreProducto || 'Producto sin nombre'}
                  </span>
                </td>
                <td className="quantity">
                  {producto.totalVendido?.toLocaleString() || 0}
                </td>
                <td className="revenue">
                  S/. {(producto.ingresosTotales || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductosTable;
