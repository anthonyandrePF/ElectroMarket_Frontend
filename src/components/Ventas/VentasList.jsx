import React, { useState, useEffect } from "react";
import DetalleVentaList from "../DetalleVenta/DetalleVentaList";
import "./VentasList.css";

function VentasList() {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/ventas")
      .then((res) => res.json())
      .then((data) => setVentas(data))
      .catch((err) => console.error("Error cargando ventas:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando ventas...</p>;

  return (
    <div className="ventas-container">
      {!ventaSeleccionada ? (
        <>
          <h2>Listado de Ventas</h2>
          <table className="ventas-table">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Ver Detalles</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.idVenta}>
                  <td>{venta.idVenta}</td>
                  <td>{venta.cliente?.nombre || "Sin cliente"}</td>
                  <td>{new Date(venta.fecha).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => setVentaSeleccionada(venta.idVenta)}
                      className="btn-ver"
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <button
            className="btn-volver"
            onClick={() => setVentaSeleccionada(null)}
          >
            ← Volver
          </button>
          <DetalleVentaList ventaId={ventaSeleccionada} />
        </>
      )}
    </div>
  );
}

export default VentasList;
