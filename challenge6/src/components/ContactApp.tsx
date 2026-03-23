import { useEffect, useMemo, useState } from 'react'
import { IonButton, IonGrid, IonInput, IonItem, IonLabel, IonRow, IonCol, IonText } from '@ionic/react'
import { useHistory } from 'react-router-dom'
import ContactList from './ContactList'
import useCollection from '../hooks/useCollection'
import useNetwork from '../hooks/useNetwork'

interface Contact {
  id: string
  name: string
  phone: string
}

function ContactApp() {
  const { results, isPending, error, getAll, add, update, remove } = useCollection<Contact>('contacts')
  const history = useHistory()
  const { isOnline } = useNetwork()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const contacts = useMemo(() => results ?? [], [results])

  useEffect(() => {
    if (isOnline) {
      getAll()
    }
  }, [isOnline])

  const handleSaveContact = async () => {
    if (!isOnline) return
    if (name.trim() && phone.trim()) {
      await add({ name, phone })

      setName('')
      setPhone('')
      await getAll()
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!isOnline) return
    await remove(id)
    await getAll()
  }

  const handleStartEdit = (contact: Contact) => {
    if (!isOnline) return
    history.push(`/edit-contact/${contact.id}`, { contact })
  }

  return (
    <>
      {!isOnline && (
        <IonText color="warning">
          <p>Offline: CRUD de contacts desactivado.</p>
        </IonText>
      )}

      <IonGrid>
        <IonRow>
          <IonCol>
            <IonInput
              label="Name"
              labelPlacement="stacked"
              type="text"
              value={name}
              onIonInput={(e) => setName(e.detail.value || '')}
              fill="outline"
              disabled={!isOnline}
            />
          </IonCol>
          <IonCol>
            <IonInput
              label="Phone"
              labelPlacement="stacked"
              type="tel"
              value={phone}
              onIonInput={(e) => setPhone(e.detail.value || '')}
              fill="outline"
              disabled={!isOnline}
            />
          </IonCol>
          <IonCol size="12" sizeMd="auto" className="ion-align-self-end">
            <IonButton
              onClick={handleSaveContact}
              disabled={!isOnline || !name.trim() || !phone.trim() || isPending}
            >
              Add
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      {error && (
        <IonItem color="danger" lines="none">
          <IonLabel>{error}</IonLabel>
        </IonItem>
      )}

      <ContactList
        contacts={contacts}
        onDelete={handleDeleteContact}
        onEdit={handleStartEdit}
        disableActions={!isOnline || isPending}
      />
    </>
  )
}

export default ContactApp