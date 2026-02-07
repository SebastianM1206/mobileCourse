import ContactItem from './ContactItem'

interface Contact {
  id: number
  name: string
  phone: string
}

interface ContactListProps {
  contacts: Contact[]
  onDelete: (id: number) => void
}

function ContactList({ contacts, onDelete }: ContactListProps) {
  return (
    <div className="mt-5">
      <h2 className="mb-4 text-xl">Contacts</h2>
      {contacts.length === 0 ? (
        <p className="text-gray-400">No contacts</p>
      ) : (
        <ul className="list-none p-0">
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              id={contact.id}
              name={contact.name}
              phone={contact.phone}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default ContactList
