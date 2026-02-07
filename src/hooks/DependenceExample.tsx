import { useState, useEffect } from "react";

const DependenceExample = () => {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    console.log("El componente rompio:", nombre);
  }, [nombre]);

  return (
    <>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Escribe tu nombre porfa uwu"
      />
      <div>Hola, {nombre}</div>
    </>
  );
};

export default DependenceExample;