import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonLabel,
  IonItem,
  IonList,
  IonTextarea,
  IonToast,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { Visita } from '../App';

interface RouteParams {
  id: string;
}

interface DetalleVisitaPageProps {
  visitas: Visita[];
}

const DetalleVisitaPage: React.FC<DetalleVisitaPageProps> = ({ visitas }) => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const [receta, setReceta] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const visitaData = visitas.find((v) => v.id === id);

  if (!visitaData) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonBackButton defaultHref="/tabs/visitas" />
            <IonTitle>Detalle de Visita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>Visita no encontrada</p>
        </IonContent>
      </IonPage>
    );
  }

  const handleGuardar = () => {
    if (!diagnostico.trim() || !receta.trim()) {
      setToastMessage('Por favor completa todos los campos');
      setShowToast(true);
      return;
    }

    setToastMessage('Visita guardada exitosamente');
    setShowToast(true);

    setTimeout(() => {
      history.goBack();
    }, 2000);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonBackButton defaultHref="/tabs/visitas" />
          <IonTitle>Detalle de Visita</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="detalle-container">
          <IonCard className="info-card">
            <IonCardContent>
              <h2 className="paciente-nombre">{visitaData.paciente}</h2>
              <IonList>
                <IonItem lines="inset">
                  <IonLabel>
                    <h3>Teléfono</h3>
                    <p>{visitaData.telefono}</p>
                  </IonLabel>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>
                    <h3>Dirección</h3>
                    <p>{visitaData.direccion}</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>

          <IonCard className="hora-card">
            <IonCardContent>
              <p>
                <strong>Hora programada:</strong> {visitaData.hora}
              </p>
              <p>
                <strong>Estado:</strong> {visitaData.estado}
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard className="form-card">
            <IonCardContent>
              <h3>Diagnóstico y Receta</h3>

              <div className="form-item">
                <label className="form-label">Diagnóstico</label>
                <IonTextarea
                  placeholder="Escribe el diagnóstico"
                  value={diagnostico}
                  onIonChange={(e) => setDiagnostico(e.detail.value || '')}
                  rows={3}
                />
              </div>

              <div className="form-item">
                <label className="form-label">Receta Médica</label>
                <IonTextarea
                  placeholder="Escribe la receta (medicamentos, dosis, indicaciones)"
                  value={receta}
                  onIonChange={(e) => setReceta(e.detail.value || '')}
                  rows={4}
                />
              </div>

              <div className="form-buttons">
                <IonButton onClick={() => history.goBack()} color="medium">
                  Cancelar
                </IonButton>
                <IonButton onClick={handleGuardar} color="primary" expand="block">
                  Guardar Visita
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          position="top"
          color={toastMessage.includes('exitosamente') ? 'success' : 'danger'}
        />
      </IonContent>
    </IonPage>
  );
};

export default DetalleVisitaPage;
