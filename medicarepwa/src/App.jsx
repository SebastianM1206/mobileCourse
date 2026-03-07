import LoginForm from "./components/LoginForm";
import Header from "./components/Header";
import PerfilUsuario from "./components/PerfilUsuario";
import Dashboard from "./components/Dashboard";
import { useState, useEffect } from "react";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [showPerfil, setShowPerfil] = useState(false);

  // Agarro la sesion del local storage  
  useEffect(() => {
    const data = localStorage.getItem("medicare_usuario");
    if (data) setUsuario(JSON.parse(data));
  }, []);

  // Guardo de one el s
  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem("medicare_usuario", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("medicare_usuario");
  };

  const handleAvatarChange = (avatar) => {
    const nuevo = { ...usuario, avatar };
    setUsuario(nuevo);
    localStorage.setItem("medicare_usuario", JSON.stringify(nuevo));
  };

  if (!usuario) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Header
        usuario={usuario}
        onLogout={handleLogout}
        onPerfil={() => setShowPerfil(true)}
      />
      {showPerfil && (
        <PerfilUsuario
          usuario={usuario}
          onClose={() => setShowPerfil(false)}
          onAvatarChange={handleAvatarChange}
        />
      )}
      <Dashboard usuario={usuario} />
    </div>
  );
}

export default App;
