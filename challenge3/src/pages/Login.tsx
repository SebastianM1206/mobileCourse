import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonText } from '@ionic/react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'

//CHALLENGE 4 LOGIC
const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()

  const handleLogin = () => {
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (email !== 'user@mail.com' || password !== '123') {
      setError('Invalid email or password')
      return
    }

    
    localStorage.setItem('logged', 'true')
    localStorage.setItem('userEmail', email)

    
    history.push('/listing-task')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard style={{ marginTop: '2rem' }}>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value || '')}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value || '')}
              />
            </IonItem>

            {error && (
              <IonText color="danger" style={{ marginTop: '1rem' }}>
                <p>{error}</p>
              </IonText>
            )}

            <IonButton expand="block" color="primary" onClick={handleLogin} style={{ marginTop: '2rem' }}>
              Login
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonText color="medium" style={{ marginTop: '2rem' }}>
          <p style={{ textAlign: 'center' }}>
            <strong>Demo credentials:</strong>
            <br />
            Email: user@mail.com
            <br />
            Password: 123
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  )
}

export default Login
