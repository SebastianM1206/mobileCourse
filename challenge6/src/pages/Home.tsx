import { IonHeader, IonPage, IonTitle, IonToolbar, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonGrid, IonRow, IonCol, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { list, people, nutrition, logOut } from 'ionicons/icons';
import { useAuthContext } from '../context/AuthContext';


const Home: React.FC = () => {
  const history = useHistory();
  const { logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
          <IonButton slot="end" color="danger" onClick={handleLogout}>
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Tasks</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton expand="block" onClick={() => history.push('/listing-task')}>
                    <IonIcon icon={list} slot="start" />
                    Go to Tasks
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Contacts</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton expand="block" onClick={() => history.push('/contacts')}>
                    <IonIcon icon={people} slot="start" />
                    Go to Contacts
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Fruits</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonButton expand="block" onClick={() => history.push('/fruits')}>
                    <IonIcon icon={nutrition} slot="start" />
                    Go to Fruits
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
