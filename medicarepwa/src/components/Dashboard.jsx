import React, { useState, useEffect } from "react";
import BuscadorPacientes from "./BuscadorPacientes";
import TablaPacientes from "./TablaPacientes";
import FormularioPaciente from "./FormularioPaciente";

export default function Dashboard({ usuario }) {
  const [busqueda, setBusqueda] = useState("");
  const [pacientes, setPacientes] = useState([]);
  const [pacienteAEditar, setPacienteAEditar] = useState(null);

  // Cargar pacientes de localStorage
  useEffect(() => {
    const data = localStorage.getItem("medicare_pacientes");
    if (data) setPacientes(JSON.parse(data));
  }, []);

  // Guardar pacientes en localStorage
  const guardarPacientes = (nuevos) => {
    setPacientes(nuevos);
    localStorage.setItem("medicare_pacientes", JSON.stringify(nuevos));
  };

  // Filtrar pacientes
  const pacientesFiltrados = pacientes.filter((p) => {
    const texto = busqueda.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(texto) ||
      p.apellido.toLowerCase().includes(texto) ||
      p.dni.toLowerCase().includes(texto)
    );
  });

  // Guardar paciente (alta o edición)
  const handleGuardarPaciente = (paciente) => {
    let nuevos;
    if (pacienteAEditar) {
      nuevos = pacientes.map((p) => (p.id === paciente.id ? paciente : p));
    } else {
      nuevos = [...pacientes, paciente];
    }
    guardarPacientes(nuevos);
    setPacienteAEditar(null);
  };


  const handleEliminarPaciente = (id) => {
    const nuevos = pacientes.filter((p) => p.id !== id);
    guardarPacientes(nuevos);
    setPacienteAEditar(null);
  };

  // justificca: el estado de búsqueda vive en Dashboard porque el filtro afecta la lista global de pacientes y permite que otros componentes accedan al estado ya filtrado 

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <BuscadorPacientes busqueda={busqueda} setBusqueda={setBusqueda} />
      {/* Sección estadísticas solo para medico */}
      {usuario.rol === "medico" && (
        <div className="stats">Estadísticas (placeholder)</div>
      )}
      {/* Formulario alta solo para recepcionista */}
      {usuario.rol === "recepcionista" && (
        <div>
          <button onClick={() => setPacienteAEditar(null)}>
            Nuevo paciente
          </button>
          {typeof pacienteAEditar !== "undefined" && (
            <FormularioPaciente
              pacienteAEditar={pacienteAEditar}
              onGuardar={handleGuardarPaciente}
              onCancelar={() => setPacienteAEditar(null)}
            />
          )}
        </div>
      )}
      {/* TablaPacientes */}
      <TablaPacientes
        pacientes={pacientesFiltrados}
        onEditar={(p) => setPacienteAEditar(p)}
        onEliminar={handleEliminarPaciente}
      />
    </div>
  );
}
