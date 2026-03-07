import React, { useState } from "react";

export default function PerfilUsuario({ usuario, onClose, onAvatarChange }) {
  const [preview, setPreview] = useState(usuario.avatar || null);
  const [file, setFile] = useState(null);

  //Manejo la selección de archivo que no recordaba como era
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(f);
      setFile(f);
    }
  };

  const handleSave = () => {
    onAvatarChange(preview);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          Perfil de usuario
        </h2>
        <div className="flex justify-center mb-4">
          {preview ? (
            <img
              src={preview}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
              {usuario.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="block w-full mb-4"
        />
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
