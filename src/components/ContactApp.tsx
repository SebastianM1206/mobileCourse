import { useState, useEffect } from 'react'
import Loader from './Loader'
import ContactList from './ContactList'

interface Contact {
  id: number
  name: string
  phone: string
}

function ContactApp() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const initialContacts: Contact[] = [
        { id: 1, name: 'Happy alejandro', phone: '324542323' },
        { id: 2, name: 'Krhss', phone: '45453' },
        { id: 3, name: 'Baldor', phone: '3135566' }
      ]
      setContacts(initialContacts)
      setLoading(false)
    }, 2000)
  }, [])

  const handleAddContact = () => {
    if (name.trim() && phone.trim()) {
      const newContact: Contact = {
        id: Date.now(),
        name,
        phone
      }
      setContacts([...contacts, newContact])
      setName('')
      setPhone('')
    }
  }

  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id))
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-center mb-8 text-3xl">Contact Manager</h1>
      
      <div className="mb-5 flex gap-2.5">
        <input 
          type="text" 
          placeholder="Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
        />
        <input 
          type="text" 
          placeholder="Phone" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
        />
        <button 
          onClick={handleAddContact}
          className="px-5 py-2 bg-green-500 text-white border-none rounded cursor-pointer text-sm hover:bg-green-600"
        >
          Add
        </button>
      </div>

      <ContactList contacts={contacts} onDelete={handleDeleteContact} />
    </div>
  )
}

export default ContactApp
