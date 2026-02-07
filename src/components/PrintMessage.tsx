interface Prop {
    message: string
}

function PrintMessage({message}: Prop) {
  return (
    <h3 className="text-blue-500">{message}</h3>
  )
}

export default PrintMessage