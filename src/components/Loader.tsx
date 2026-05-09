interface LoaderProps {
  message?: string
}

function Loader({ message = 'Cargando...' }: LoaderProps) {
  return (
    <div className="p-5 text-center">
      <p className="text-lg text-slate-600">{message}</p>
    </div>
  )
}

export default Loader
