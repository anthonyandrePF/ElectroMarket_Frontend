import React, { useState, useEffect } from "react";
import "./App.css";
import ProductosList from "./components/Productos/ProductosList";
import ClientesList from "./components/Clientes/ClientesList";
import VentasList from "./components/Ventas/VentasList";
import LoginForm from "./components/Login/LoginForm";
import Dashboard from "./components/Dashboard/Dashboard";
import GestionUsuario from "./components/Usuarios/GestionUsuario";

function App() {
  const [currentView, setCurrentView] = useState("inicio");
  const [usuario, setUsuario] = useState(null);
  const [horaActual, setHoraActual] = useState("");
  const [frase, setFrase] = useState("Organiza tus ventas con estilo 🚀");

  // Frases motivacionales / informativas
  const frases = [
    "Organiza tus ventas con estilo 🚀",
    "Control total de tu negocio 💼",
    "Optimiza tu inventario en segundos ⚡",
    "Administra clientes con eficiencia 👥",
  ];

// 🕒 Reloj en vivo
useEffect(() => {
  const actualizarHora = () => {
    const fecha = new Date();

    const dias = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];

    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "p.m." : "a.m.";
    horas = ((horas + 11) % 12) + 1;

    const horaFormateada = `${horas}:${minutos} ${ampm}`;
    const fechaFormateada = `${diaSemana}, ${dia} de ${mes}`;

    setHoraActual(`${fechaFormateada} — ${horaFormateada} | Lima, Perú`);
  };

  actualizarHora();
  const interval = setInterval(actualizarHora, 1000);
  return () => clearInterval(interval);
}, []);


  // Frase rotatoria
  useEffect(() => {
    const interval = setInterval(() => {
      setFrase(frases[Math.floor(Math.random() * frases.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("usuario");
    if (savedUser) setUsuario(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    setCurrentView("inicio");
  };

  const renderContent = () => {
    if (!usuario) {
      return <LoginForm onLoginSuccess={setUsuario} />;
    }

    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "productos":
        return <ProductosList />;
      case "clientes":
        return <ClientesList />;
      case "ventas":
        return <VentasList />;
      case "usuarios":
        return <GestionUsuario />;
      default:
        return (
          <div className="welcome-container">
            <div className="welcome-card">
              <h2 className="welcome-title">
                ¡Hola, <span>{usuario.nombre}</span>! 👋
              </h2>
              <p className="welcome-text">{frase}</p>

              {/* Animación tipo escritura */}
              <div className="welcome-animation">
                <p className="typing-text">
                  ⚡ Sistema rápido, intuitivo y moderno ⚡
                </p>
              </div>

              {/* Fecha y hora */}
              <p className="welcome-time">{horaActual}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      {usuario ? (
        <>
          {/* HEADER */}
          <header className="app-header">
            <div className="header-content">
              <div className="header-title">
                <h1 className="text-fluor hover-grow">🏪 ElectroMarket</h1>
                <p>Sistema de Gestión de Ventas (Admin)</p>
              </div>
              <div className="user-info">
                <span>Bienvenido, {usuario.nombre}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </header>

          {/* NAVBAR */}
          <nav className="navigation">
            <div className="menu-horizontal">
              {[
                { key: "inicio", label: "🏠 Inicio" },
                { key: "dashboard", label: "📊 Dashboard" },
                { key: "productos", label: "📦 Productos" },
                { key: "clientes", label: "👥 Clientes" },
                { key: "ventas", label: "💰 Ventas" },
                { key: "usuarios", label: "👨‍💼 Usuarios" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setCurrentView(key)}
                  className={`menu-btn ${currentView === key ? "active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <main className="main-content">{renderContent()}</main>
        </>
      ) : (
        renderContent()
      )}
    </div>
  );
}

export default App;

