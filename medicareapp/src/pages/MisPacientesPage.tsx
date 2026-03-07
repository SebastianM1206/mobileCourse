import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonSearchbar,
} from '@ionic/react';

interface Paciente {
  id: string;
  nombre: string;
  edad: number;
  telefono: string;
  diagnostico: string;
}

const MisPacientesPage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [pacientes] = useState<Paciente[]>([
    {
      id: '1',
      nombre: 'Juan Rodríguez',
      edad: 60,
      telefono: '555-0101',
      diagnostico: 'Diabetes tipo 2',
    },
    {
      id: '2',
      nombre: 'María González',
      edad: 45,
      telefono: '555-0102',
      diagnostico: 'Hipertensión arterial',
    },
    {
      id: '3',
      nombre: 'Carlos López',
      edad: 72,
      telefono: '555-0103',
      diagnostico: 'Insuficiencia cardíaca',
    },
    {
      id: '4',
      nombre: 'Ana Martínez',
      edad: 38,
      telefono: '555-0104',
      diagnostico: 'Asma',
    },
    {
      id: '5',
      nombre: 'Pedro Sánchez',
      edad: 55,
      telefono: '555-0105',
      diagnostico: 'Artritis reumatoide',
    },
  ]);

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nombre.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value || '')}
          placeholder="Buscar paciente..."
        />

        <div className="pacientes-container">
          <IonList>
            {pacientesFiltrados.map((paciente) => (
              <IonCard key={paciente.id} className="paciente-card">
                <IonCardContent className="paciente-content">
                  <h2 className="paciente-nombre">{paciente.nombre}</h2>
                  <p className="paciente-edad">Edad: {paciente.edad} años</p>
                  <p className="paciente-diagnostico">{paciente.diagnostico}</p>
                  <p className="paciente-telefono">{paciente.telefono}</p>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>

          {pacientesFiltrados.length === 0 && (
            <div className="empty-state">
              <p>No se encontraron pacientes</p>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MisPacientesPage;
