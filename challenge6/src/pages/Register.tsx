import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonCard, IonCardContent, IonItem, IonLabel, IonText } from '@ionic/react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

const Register: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()
  const { register } = useAuthContext()

  const handleRegister = async() => {
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try{
      await register(email, password)
      history.push('/home')
    }catch(err: any){
      setError('Error registering')
      return
    } 
    
    
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register (create new account)</IonTitle>
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

            <IonButton expand="block" color="primary" onClick={handleRegister} style={{ marginTop: '2rem' }}>
              Register
            </IonButton>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  )
}

export default Register

