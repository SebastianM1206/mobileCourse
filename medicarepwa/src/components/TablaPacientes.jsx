import React, { useState } from "react";

export default function TablaPacientes({ pacientes, onEditar, onEliminar }) {
  const [idEliminar, setIdEliminar] = useState(null);

  return (
    <div>
      <table className="min-w-full border border-gray-300 rounded overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">DNI</th>
            <th className="px-4 py-2 text-left">Teléfono</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">
                {p.nombre} {p.apellido}
              </td>
              <td className="px-4 py-2">{p.dni}</td>
              <td className="px-4 py-2">{p.telefono}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  onClick={() => onEditar(p)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => setIdEliminar(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {idEliminar && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
            <p className="mb-4 text-center">
              ¿Seguro que quieres eliminar este paciente?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  onEliminar(idEliminar);
                  setIdEliminar(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setIdEliminar(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
