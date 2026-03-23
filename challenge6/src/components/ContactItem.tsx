import { IonButton, IonButtons, IonIcon, IonItem, IonLabel } from '@ionic/react'
import { create, trash } from 'ionicons/icons'

interface Contact {
  id: string
  name: string
  phone: string
}

interface ContactItemProps {
  contact: Contact
  onDelete: (id: string) => void
  onEdit: (contact: Contact) => void
  disabled: boolean
}

function ContactItem({ contact, onDelete, onEdit, disabled }: ContactItemProps) {
  return (
    <IonItem>
      <IonLabel>
        <h2>{contact.name}</h2>
        <p>{contact.phone}</p>
      </IonLabel>
      <IonButtons slot="end">
        <IonButton color="primary" fill="clear" onClick={() => onEdit(contact)} disabled={disabled}>
          <IonIcon icon={create} />
        </IonButton>
        <IonButton color="danger" fill="clear" onClick={() => onDelete(contact.id)} disabled={disabled}>
          <IonIcon icon={trash} />
        </IonButton>
      </IonButtons>
    </IonItem>
  )
}

export default ContactItem