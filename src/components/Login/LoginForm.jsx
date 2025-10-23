import React, { useState } from "react";
import "./LoginForm.css";

function LoginForm({ onLoginSuccess }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!response.ok) {
        const text = await response.text();
        setError(text);
        return;
      }

      const user = await response.json();
      localStorage.setItem("usuario", JSON.stringify(user));
      onLoginSuccess(user);
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-bg">
      <div className="tech-overlay"></div>
      <div className="login-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
