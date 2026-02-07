interface ContactItemProps {
  id: number
  name: string
  phone: string
  onDelete: (id: number) => void
}

function ContactItem({ id, name, phone, onDelete }: ContactItemProps) {
  return (
    <li className="p-2.5 mb-2 bg-gray-100 rounded flex justify-between items-center">
      <span>{name} - {phone}</span>
      <button 
        onClick={() => onDelete(id)}
        className="px-3 py-1.5 bg-red-500 text-white border-none rounded cursor-pointer hover:bg-red-600"
      >
        Delete
      </button>
    </li>
  )
}

export default ContactItem
