import React, { useState, useEffect } from "react";

export default function FormularioPaciente({
  pacienteAEditar,
  onGuardar,
  onCancelar,
}) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (pacienteAEditar) {
      setNombre(pacienteAEditar.nombre);
      setApellido(pacienteAEditar.apellido);
      setDni(pacienteAEditar.dni);
      setTelefono(pacienteAEditar.telefono || "");
    } else {
      setNombre("");
      setApellido("");
      setDni("");
      setTelefono("");
    }
    setError("");
  }, [pacienteAEditar]);

  const validar = () => {
    if (!nombre || !apellido || !dni) {
      setError("Nombre, apellido y DNI son obligatorios");
      return false;
    }
    if (!/^\d{7,8}$/.test(dni)) {  //Aquí no sabía que se podía hacer así jasj
      setError("DNI debe tener 7 u 8 dígitos numéricos");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;
    const paciente = {
      id: pacienteAEditar ? pacienteAEditar.id : Date.now(),
      nombre,
      apellido,
      dni,
      telefono,
    };
    onGuardar(paciente);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow max-w-md mx-auto flex flex-col gap-4 mt-4"
    >
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
      />
      <input
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
      />
      <input
        placeholder="DNI"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
      />
      <input
        placeholder="Teléfono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
      />
      {error && (
        <div className="text-red-600 text-sm font-semibold">{error}</div>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          {pacienteAEditar ? "Guardar cambios" : "Agregar paciente"}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
