export default function Header({ usuario, onLogout, onPerfil }) {
  const avatar = usuario.avatar;
  const iniciales = usuario.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <header className="flex items-center bg-blue-600 text-white px-4 py-2 shadow">
      <div className="mr-3 cursor-pointer" onClick={onPerfil}>
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center font-bold text-lg">
            {iniciales}
          </div>
        )}
      </div>
      <span className="font-semibold text-lg">{usuario.nombre}</span>
      <button
        onClick={onLogout}
        className="ml-auto bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 font-semibold"
      >
        Logout
      </button>
    </header>
  );
}
