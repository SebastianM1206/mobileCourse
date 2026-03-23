import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonContent, IonInput, IonGrid, IonRow, IonCol, IonIcon, IonBackButton, IonButtons, IonText } from '@ionic/react'
import { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { checkmark, logOut } from 'ionicons/icons'
import { useAuthContext } from '../context/AuthContext'
import useCollection from '../hooks/useCollection'
import useNetwork from '../hooks/useNetwork'

interface Contact {
  id: string
  name: string
  phone: string
}

interface RouteParams {
  id: string
}

interface LocationState {
  contact?: Contact
}

const EditContact: React.FC = () => {
  const { id } = useParams<RouteParams>()
  const location = useLocation<LocationState>()
  const history = useHistory()
  const { logout } = useAuthContext()
  const { isOnline } = useNetwork()
  const { results, isPending, update, getAll } = useCollection<Contact>('contacts')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    getAll()
  }, [])

  useEffect(() => {
    const contactFromState = location.state?.contact
    const contactFromResults = (results ?? []).find((contact) => contact.id === id)
    const current = contactFromState ?? contactFromResults

    if (current) {
      setName(current.name)
      setPhone(current.phone)
    }
  }, [id, location.state, results])

  const handleSave = async () => {
    if (!isOnline || !name.trim() || !phone.trim()) return

    const ok = await update(id, { name: name.trim(), phone: phone.trim() })
    if (ok) {
      history.push('/contacts')
    }
  }

  const handleLogout = async () => {
    await logout()
    history.push('/login')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/contacts"></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Contact</IonTitle>
          <IonButton slot="end" onClick={handleLogout} color="danger">
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {!isOnline && (
          <IonText color="warning">
            <p>Offline: no se puede editar contacts.</p>
          </IonText>
        )}

        <IonGrid style={{ marginTop: '2rem' }}>
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
          </IonRow>

          <IonRow style={{ marginTop: '1rem' }}>
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
          </IonRow>

          <IonRow style={{ marginTop: '2rem' }}>
            <IonCol>
              <IonButton expand="block" onClick={handleSave} color="primary" disabled={!isOnline || isPending || !name.trim() || !phone.trim()}>
                <IonIcon icon={checkmark} slot="start" />
                Save Contact
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default EditContact
