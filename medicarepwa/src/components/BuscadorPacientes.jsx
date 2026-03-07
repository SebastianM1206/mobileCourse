import React from "react";

export default function BuscadorPacientes({ busqueda, setBusqueda }) {
  return (
    <input
      placeholder="Buscar paciente"
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="border border-gray-300 rounded px-3 py-2 mb-4 w-full focus:outline-none focus:ring focus:border-blue-500"
    />
  );
}
