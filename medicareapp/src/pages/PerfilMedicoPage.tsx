import React from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar,
  IonImg,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';

const PerfilMedicoPage: React.FC = () => {
  const history = useHistory();

  const getUserData = () => {
    const userData = localStorage.getItem('medicareUser');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  const user = getUserData();

  const getInitials = (nombre: string) => {
    const parts = nombre.split(' ');
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem('medicareUser');
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="perfil-container">
          <IonCard className="perfil-card">
            <IonCardContent className="avatar-section">
              <IonAvatar className="perfil-avatar">
                <div className="avatar-initials">{getInitials(user?.nombre || '')}</div>
              </IonAvatar>
              <h2 className="perfil-nombre">{user?.nombre}</h2>
              <p className="perfil-especialidad">{user?.especialidad}</p>
            </IonCardContent>
          </IonCard>

          <IonCard className="info-card">
            <IonCardContent>
              <IonList>
                <IonItem lines="inset">
                  <IonLabel>
                    <h3>Email</h3>
                    <p>{user?.email}</p>
                  </IonLabel>
                </IonItem>
                <IonItem lines="inset">
                  <IonLabel>
                    <h3>ID Médico</h3>
                    <p>{user?.id}</p>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <h3>Especialidad</h3>
                    <p>{user?.especialidad}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <div className="logout-section">
            <IonButton expand="block" color="danger" onClick={handleLogout}>
              Cerrar Sesión
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PerfilMedicoPage;
