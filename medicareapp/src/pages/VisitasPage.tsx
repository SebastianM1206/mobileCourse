import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonReorderGroup,
  IonReorder,
  IonIcon,
  IonAlert,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { trash, arrowForward } from 'ionicons/icons';
import { Visita } from '../App';

interface VisitasPageProps {
  visitas: Visita[];
  setVisitas: (visitas: Visita[]) => void;
}

const VisitasPage: React.FC<VisitasPageProps> = ({ visitas, setVisitas }) => {
  const history = useHistory();
  const [filter, setFilter] = useState<string>('todas');
  const [showAlert, setShowAlert] = useState(false);
  const [selectedVisita, setSelectedVisita] = useState<string>('');

  const filteredVisitas = visitas.filter((visita) => {
    if (filter === 'todas') return true;
    return visita.estado === filter;
  });

  const visitasPendientes = visitas.filter((v) => v.estado === 'pendiente');
  const visitasNoReordenables = visitas.filter(
    (v) => v.estado !== 'pendiente'
  );

  const handleEnCamino = (id: string) => {
    setVisitas(
      visitas.map((v) =>
        v.id === id ? { ...v, estado: 'en_camino' } : v
      )
    );
  };

  const handleCancelar = (id: string) => {
    setSelectedVisita(id);
    setShowAlert(true);
  };

  const confirmCancel = () => {
    setVisitas(
      visitas.map((v) =>
        v.id === selectedVisita ? { ...v, estado: 'cancelada' } : v
      )
    );
    setShowAlert(false);
  };

  const handleReorder = (event: CustomEvent) => {
    const reorderedItems = event.detail.complete(visitasPendientes);
    const newVisitas = [...reorderedItems, ...visitasNoReordenables];
    setVisitas(newVisitas);
  };

  const handleVerDetalle = (id: string) => {
    history.push(`/tabs/visitas/${id}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas del Día</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="visitas-container">
          <div className="segment-container">
            <IonSegment value={filter} onIonChange={(e) => setFilter(e.detail.value as string)}>
              <IonSegmentButton value="todas">Todas</IonSegmentButton>
              <IonSegmentButton value="pendiente">Pendientes</IonSegmentButton>
              <IonSegmentButton value="en_camino">En curso</IonSegmentButton>
              <IonSegmentButton value="completada">Finalizadas</IonSegmentButton>
            </IonSegment>
          </div>

          {filter === 'todas' || filter === 'pendiente' ? (
            <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
              <IonList>
                {visitasPendientes.map((visita) => (
                  <IonItemSliding key={visita.id} className="visita-sliding">
                    <IonItemOptions side="start">
                      <IonItemOption
                        color="secondary"
                        onClick={() => handleVerDetalle(visita.id)}
                      >
                        <IonIcon icon={arrowForward} /> Ver detalle
                      </IonItemOption>
                    </IonItemOptions>

                    <IonItem>
                      <IonReorder slot="start" />
                      <IonLabel>
                        <h2>{visita.paciente}</h2>
                        <p>{visita.hora}</p>
                        <p>{visita.direccion}</p>
                      </IonLabel>
                      <IonBadge slot="end" color="danger">
                        Pendiente
                      </IonBadge>
                    </IonItem>

                    <IonItemOptions side="end">
                      <IonItemOption
                        color="primary"
                        onClick={() => handleEnCamino(visita.id)}
                      >
                        En camino
                      </IonItemOption>
                      <IonItemOption
                        color="danger"
                        onClick={() => handleCancelar(visita.id)}
                      >
                        <IonIcon icon={trash} /> Cancelar
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                ))}
              </IonList>
            </IonReorderGroup>
          ) : null}

          {filter === 'todas' &&
            visitasNoReordenables.length > 0 && (
              <IonList>
                {visitasNoReordenables.map((visita) => (
                  <IonItemSliding key={visita.id}>
                    <IonItemOptions side="start">
                      <IonItemOption
                        color="secondary"
                        onClick={() => handleVerDetalle(visita.id)}
                      >
                        <IonIcon icon={arrowForward} /> Ver detalle
                      </IonItemOption>
                    </IonItemOptions>

                    <IonItem>
                      <IonLabel>
                        <h2>{visita.paciente}</h2>
                        <p>{visita.hora}</p>
                        <p>{visita.direccion}</p>
                      </IonLabel>
                      <IonBadge
                        slot="end"
                        color={
                          visita.estado === 'completada'
                            ? 'success'
                            : visita.estado === 'en_camino'
                              ? 'warning'
                              : 'medium'
                        }
                      >
                        {visita.estado === 'completada'
                          ? 'Completada'
                          : visita.estado === 'en_camino'
                            ? 'En curso'
                            : 'Cancelada'}
                      </IonBadge>
                    </IonItem>

                    <IonItemOptions side="end">
                      <IonItemOption
                        color="secondary"
                        onClick={() => handleVerDetalle(visita.id)}
                      >
                        Ver detalle
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                ))}
              </IonList>
            )}

          {filter !== 'todas' && (
            <IonList>
              {filteredVisitas.map((visita) => (
                <IonItemSliding key={visita.id}>
                  <IonItemOptions side="start">
                    <IonItemOption
                      color="secondary"
                      onClick={() => handleVerDetalle(visita.id)}
                    >
                      <IonIcon icon={arrowForward} /> Ver detalle
                    </IonItemOption>
                  </IonItemOptions>

                  <IonItem>
                    <IonLabel>
                      <h2>{visita.paciente}</h2>
                      <p>{visita.hora}</p>
                      <p>{visita.direccion}</p>
                    </IonLabel>
                    <IonBadge
                      slot="end"
                      color={
                        visita.estado === 'completada'
                          ? 'success'
                          : visita.estado === 'en_camino'
                            ? 'warning'
                            : visita.estado === 'pendiente'
                              ? 'danger'
                              : 'medium'
                      }
                    >
                      {visita.estado === 'completada'
                        ? 'Completada'
                        : visita.estado === 'en_camino'
                          ? 'En curso'
                          : visita.estado === 'pendiente'
                            ? 'Pendiente'
                            : 'Cancelada'}
                    </IonBadge>
                  </IonItem>

                  <IonItemOptions side="end">
                    {filter === 'pendiente' && (
                      <>
                        <IonItemOption
                          color="primary"
                          onClick={() => handleEnCamino(visita.id)}
                        >
                          En camino
                        </IonItemOption>
                        <IonItemOption
                          color="danger"
                          onClick={() => handleCancelar(visita.id)}
                        >
                          <IonIcon icon={trash} /> Cancelar
                        </IonItemOption>
                      </>
                    )}
                    {filter !== 'pendiente' && (
                      <IonItemOption
                        color="secondary"
                        onClick={() => handleVerDetalle(visita.id)}
                      >
                        Ver detalle
                      </IonItemOption>
                    )}
                  </IonItemOptions>
                </IonItemSliding>
              ))}
            </IonList>
          )}
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Cancelar Visita"
          message="¿Estás seguro de que deseas cancelar esta visita?"
          buttons={[
            {
              text: 'No cancelar',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Confirmar',
              handler: confirmCancel,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default VisitasPage;
