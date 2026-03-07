import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonToast,
  IonLoading,
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
} from '@ionic/react';
import { eye, eyeOff } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('doctor@medicare.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const validUsers = [
    {
      id: '1',
      email: 'doctor@medicare.com',
      password: 'password123',
      nombre: 'Dr. Juan Pérez',
      especialidad: 'Medicina General',
    },
    {
      id: '2',
      email: 'medico@medicare.com',
      password: 'pass456',
      nombre: 'Dra. María García',
      especialidad: 'Cardiología',
    },
  ];

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setShowToast(true);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const foundUser = validUsers.find(
        u => u.email === email && u.password === password
      );

      if (foundUser) {
        localStorage.setItem(
          'medicareUser',
          JSON.stringify({
            id: foundUser.id,
            nombre: foundUser.nombre,
            email: foundUser.email,
            especialidad: foundUser.especialidad,
          })
        );
        history.replace('/tabs/visitas');
      } else {
        setError('Credenciales inválidas');
        setShowToast(true);
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div>
          <IonCard>
            <IonCardContent>
              <h1>Medicare</h1>
              <p>Médicos en Visita</p>

              <div>
                <IonInput
                  label="Email"
                  labelPlacement="stacked"
                  type="email"
                  placeholder="ingresa tu email"
                  value={email}
                  onIonChange={(e) => setEmail(e.detail.value || '')}
                />

                <div>
                  <IonInput
                    label="Contraseña"
                    labelPlacement="stacked"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="ingresa tu contraseña"
                    value={password}
                    onIonChange={(e) => setPassword(e.detail.value || '')}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <IonIcon icon={showPassword ? eyeOff : eye} />
                  </button>
                </div>

                <IonButton
                  expand="block"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  Iniciar Sesión
                </IonButton>

                <p>
                  <IonText color="medium">
                    Demo: doctor@medicare.com / password123
                  </IonText>
                </p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>

        <IonLoading isOpen={loading} message={'Verificando credenciales...'} />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={error}
          duration={3000}
          color="danger"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
