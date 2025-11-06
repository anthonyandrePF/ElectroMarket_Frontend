  import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GestionUsuario.css";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/usuarios");
      setUsuarios(response.data);
    } catch {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      correo: "",
      contrasena: "",
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      if (editingUser) {
        await axios.put(
          `http://localhost:8080/api/usuarios/${editingUser.idUsuario}`,
          formData
        );
        setMessage("✅ Usuario actualizado exitosamente");
      } else {
        await axios.post("http://localhost:8080/api/usuarios", formData);
        setMessage("✅ Usuario administrador creado exitosamente");
      }

      resetForm();
      cargarUsuarios();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          `Error al ${editingUser ? "actualizar" : "crear"} usuario`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      nombre: usuario.nombre,
      correo: usuario.correo,
      contrasena: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id, nombre) => {
    if (
      !window.confirm(
        `¿Estás seguro de que deseas eliminar al usuario "${nombre}"?`
      )
    ) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/usuarios/${id}`);
      setMessage("✅ Usuario eliminado exitosamente");
      cargarUsuarios();
    } catch (error) {
      setError(error.response?.data?.message || "Error al eliminar usuario");
    }
  };

  return (
    <div className="gestion-usuarios-container">
      <div className="usuarios-header">
        <h2>👨‍💼 Gestión de Usuarios Administradores</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-toggle-form"
        >
          {showForm ? "❌ Cancelar" : "👥 Crear Nuevo Admin"}
        </button>
      </div>

      {/* Mensajes */}
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {/* Formulario de crear/editar */}
      {showForm && (
        <div className="usuario-form-container">
          <h3>
            {editingUser ? "✏️ Editar Usuario" : "👥 Crear Nuevo Usuario"}
          </h3>

          <form onSubmit={handleSubmit} className="usuario-form">
            <div className="form-group">
              <label>Nombre Completo:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Juan Pérez García"
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico:</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                placeholder="Ej: juan.perez@empresa.com"
              />
            </div>

            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder={
                  editingUser
                    ? "Dejar vacío para mantener la actual"
                    : "Mínimo 4 caracteres"
                }
                minLength={editingUser ? "0" : "4"}
              />
              {editingUser && (
                <small className="password-hint">
                  Dejar vacío para mantener la contraseña actual
                </small>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-submit">
                {loading
                  ? "⏳ Procesando..."
                  : editingUser
                  ? "💾 Actualizar Usuario"
                  : "👥 Crear Usuario"}
              </button>
              <button type="button" onClick={resetForm} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="usuarios-list">
        <h3>📋 Usuarios Administradores ({usuarios.length})</h3>

        {loading ? (
          <div className="loading">Cargando usuarios...</div>
        ) : usuarios.length === 0 ? (
          <div className="no-users">
            <p>No hay usuarios administradores registrados.</p>
          </div>
        ) : (
          <div className="usuarios-grid">
            {usuarios.map((usuario) => (
              <div key={usuario.idUsuario} className="usuario-card">
                <div className="usuario-info">
                  <h4 className="usuario-nombre">💠 {usuario.nombre}</h4>
                  <p className="usuario-email">📧 {usuario.correo}</p>
                  <p className="usuario-rol">
                    👑{" "}
                    <span className="rol-text">
                      {usuario.rol?.nombre || "Administrador"}
                    </span>
                  </p>
                </div>
                <div className="usuario-actions">
                  <button
                    onClick={() => handleEdit(usuario)}
                    className="btn-edit"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(usuario.idUsuario, usuario.nombre)
                    }
                    className="btn-delete"
                    disabled={
                      usuarios.filter((u) => u.rol?.idRol === 1).length <= 1 &&
                      usuario.rol?.idRol === 1
                    }
                  >
                    🗑️ Eliminar
                  </button>
                </div>
                {usuarios.filter((u) => u.rol?.idRol === 1).length <= 1 &&
                  usuario.rol?.idRol === 1 && (
                    <small className="delete-warning">
                      No se puede eliminar el único administrador
                    </small>
                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionUsuarios;
