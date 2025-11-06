import React, { useState } from "react";
import axios from "axios";
import "./CrearUsuario.css";

const CrearUsuario = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
  });

  const [estado, setEstado] = useState({
    loading: false,
    message: "",
    error: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado({ loading: true, message: "", error: "" });

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/registro",
        formData
      );

      if (res.data.success) {
        setEstado({
          loading: false,
          message:
            res.data.message || "✅ Usuario administrador creado exitosamente",
          error: "",
        });
        setFormData({ nombre: "", correo: "", contrasena: "" });
      } else {
        setEstado({
          loading: false,
          message: "",
          error: res.data.message || "❌ No se pudo crear el usuario",
        });
      }
    } catch (err) {
      console.error("Error en registro:", err);
      setEstado({
        loading: false,
        message: "",
        error: err.response?.data?.message || "❌ Error al crear usuario",
      });
    }
  };

  return (
    <div className="crear-usuario-container">
      <h2>👤 Crear Nuevo Usuario</h2>
      <p className="description">
        Agrega nuevos administradores con acceso completo al sistema{" "}
        <strong>ElectroMarket</strong>.
      </p>

      <form onSubmit={handleSubmit} className="usuario-form">
        <div className="form-group">
          <label>🧑 Nombre Completo</label>
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
          <label>📧 Correo Electrónico</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            placeholder="Ej: juan.perez@electromarket.com"
          />
        </div>

        <div className="form-group">
          <label>🔑 Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
            placeholder="Mínimo 4 caracteres"
            minLength="4"
          />
        </div>

        <button type="submit" disabled={estado.loading} className="btn-crear">
          {estado.loading ? "⏳ Creando..." : "✨ Crear Usuario Administrador"}
        </button>
      </form>

      {estado.message && (
        <div className="message success animate__animated animate__fadeIn">
          {estado.message}
        </div>
      )}
      {estado.error && (
        <div className="message error animate__animated animate__shakeX">
          {estado.error}
        </div>
      )}
    </div>
  );
};

export default CrearUsuario;
