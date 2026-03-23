import { IonList, IonText } from '@ionic/react'
import ContactItem from './ContactItem'

interface Contact {
  id: string
  name: string
  phone: string
}  
 
interface ContactListProps {
  contacts: Contact[]
  onDelete: (id: string) => void
  onEdit: (contact: Contact) => void
  disableActions: boolean
}

function ContactList({ contacts, onDelete, onEdit, disableActions }: ContactListProps) {
  return (
    <div>
      {contacts.length === 0 ? (
        <IonText color="medium">
          <p>No contacts</p>
        </IonText>
      ) : (
        <IonList>
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              onDelete={onDelete}
              onEdit={onEdit}
              disabled={disableActions}
            />
          ))}
        </IonList>
      )}
    </div>
  )
}

export default ContactList