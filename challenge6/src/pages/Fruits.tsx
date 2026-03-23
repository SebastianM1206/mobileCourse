import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react'
import { home, logOut } from 'ionicons/icons'
import { useHistory } from 'react-router-dom'
import FruitApp from '../components/FruitApp'
import { useAuthContext } from '../context/AuthContext'

const Fruits: React.FC = () => {
  const history = useHistory()
  const { logout } = useAuthContext()

  const handleLogout = async () => {
    await logout()
    history.push('/login')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Fruits</IonTitle>
          <IonButton slot="end" color="medium" onClick={() => history.push('/home')}>
            <IonIcon icon={home} />
          </IonButton>
          <IonButton slot="end" color="danger" onClick={handleLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Fruits (Dexie)</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <FruitApp />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default Fruits
