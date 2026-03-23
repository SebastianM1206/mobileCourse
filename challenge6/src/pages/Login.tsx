import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonText } from '@ionic/react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()
  const { login } = useAuthContext()

  const handleLogin = async() => {
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try{
      await login(email, password)
      history.push('/home')
    }catch(err: any){
      setError('Invalid email or password')
      return
    } 
  }

  const handleGoToRegister = () => {
    history.push('/register')
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

            <IonButton expand="block" color="secondary" onClick={handleGoToRegister} style={{ marginTop: '1rem' }}>
              Don't have an account? Register
            </IonButton>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  )
}

export default Login
