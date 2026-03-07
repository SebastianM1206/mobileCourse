import React, { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Credenciales para probar el tipo de user de cada uno
  const users = [
    {
      email: "medico@medicare.com",
      password: "123456",
      nombre: "Dr. Juan",
      rol: "medico",
    },
    {
      email: "recepcion@medicare.com",
      password: "654321",
      nombre: "Ana",
      rol: "recepcionista",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      setError("Usuario o contraseña incorrectos");
    } else {
      setError("");
      onLogin(user);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xs mx-auto flex flex-col gap-4 mt-16">
      <h1 className="text-2xl font-bold text-blue-600 text-center mb-4">
        Medicare+
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
        {error && (
          <div className="text-red-600 text-sm font-semibold">{error}</div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
