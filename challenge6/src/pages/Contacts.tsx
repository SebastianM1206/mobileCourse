import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText } from '@ionic/react'
import { home, logOut } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import ContactApp from '../components/ContactApp'
import { useAuthContext } from '../context/AuthContext'
import useNetwork from '../hooks/useNetwork'

const Contacts: React.FC = () => {
  const history = useHistory()
  const { logout } = useAuthContext()
  const { isOnline } = useNetwork()

  const handleLogout = async () => {
    await logout()
    history.push('/login')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Contacts</IonTitle>
          <IonButton slot="end" color="medium" onClick={() => history.push('/home')}>
            <IonIcon icon={home} />
          </IonButton>
          <IonButton slot="end" color="danger" onClick={handleLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {!isOnline && (
          <IonText color="warning">
            <p>Offline: contacts quedan solo en lectura.</p>
          </IonText>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Contact Manager</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <ContactApp />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default Contacts
