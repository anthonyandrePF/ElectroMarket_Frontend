import React, { useEffect, useState } from "react";
import './DetalleVentaList.css';

function DetalleVentaList({ ventaId }) {
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ventaId) return;
    setLoading(true);
    fetch(`http://localhost:8080/api/detalles-venta/venta/${ventaId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar detalles");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setDetalles(data);
        else throw new Error("Formato de respuesta inválido");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [ventaId]);

  if (!ventaId) return <p>Seleccione una venta para ver los detalles.</p>;
  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (detalles.length === 0) return <p>No hay detalles para esta venta.</p>;

  return (
    <div className="detalles-container">
      <h2>Detalles de la Venta #{ventaId}</h2>
      <table className="detalles-table">
        <thead>
          <tr>
            <th>ID Detalle</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((detalle) => (
            <tr key={detalle.idDetalle}>
              <td>{detalle.idDetalle}</td>
              <td>{detalle.producto?.nombre || "Producto no disponible"}</td>
              <td>{detalle.cantidad}</td>
              <td>S/ {Number(detalle.subtotal || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetalleVentaList;
