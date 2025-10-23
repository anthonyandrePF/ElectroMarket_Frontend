import React, { useEffect, useState } from "react";
import "./ClientesList.css";

function ClientesList() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/clientes")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar clientes");
        return res.json();
      })
      .then((data) => {
        setClientes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="mensaje-carga">Cargando clientes...</p>;
  if (error) return <p className="mensaje-error">{error}</p>;

  return (
    <div className="clientes-container">
      <h2>👥 Lista de Clientes</h2>
      {clientes.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <table className="tabla-clientes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.idCliente}>
                <td>{cliente.idCliente}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.direccion || "—"}</td>
                <td>{cliente.telefono || "—"}</td>
                <td>{cliente.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClientesList;
