import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonContent, IonInput, IonGrid, IonRow, IonCol, IonIcon, IonBackButton, IonButtons, IonText } from '@ionic/react'
import { useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { checkmark, logOut } from 'ionicons/icons'
import { useTaskContext, Task } from '../context/TaskContext'
import { useAuthContext } from '../context/AuthContext'
import useNetwork from '../hooks/useNetwork'

interface RouteParams {
  id: string
}

interface LocationState {
  task?: Task
}

const EditTask: React.FC = () => {
  const { id } = useParams<RouteParams>()
  const location = useLocation<LocationState>()
  const history = useHistory()
  const { tasks, updateTask } = useTaskContext()
  const { logout } = useAuthContext()
  const { isOnline } = useNetwork()

  const [title, setTitle] = useState('')
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    const taskFromState = location.state?.task
    const taskFromContext = tasks.find((task) => task.id === id)
    const current = taskFromState ?? taskFromContext

    if (current) {
      setTitle(current.title)
      setCompleted(current.completed)
    }
  }, [id, location.state, tasks])

  const handleSave = async () => {
    if (!isOnline || !title.trim()) return

    const ok = await updateTask(id, title.trim(), completed)
    if (ok) {
      history.push('/listing-task')
    }
  }

  const handleLogout = async () => {
    await logout()
    history.push('/login')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/listing-task"></IonBackButton>
          </IonButtons>
          <IonTitle>Edit Task</IonTitle>
          <IonButton slot="end" onClick={handleLogout} color="danger">
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {!isOnline && (
          <IonText color="warning">
            <p>Offline: you cannot edit tasks.</p>
          </IonText>
        )}

        <IonGrid style={{ marginTop: '2rem' }}>
          <IonRow>
            <IonCol>
              <IonInput
                type="text"
                placeholder="Task title"
                value={title}
                onIonInput={(e) => setTitle(e.detail.value || '')}
                fill="outline"
                disabled={!isOnline}
              />
            </IonCol>
          </IonRow>

          <IonRow style={{ marginTop: '1rem' }}>
            <IonCol>
              <IonButton
                expand="block"
                color={completed ? 'success' : 'medium'}
                onClick={() => setCompleted((prev) => !prev)}
                disabled={!isOnline}
              >
                {completed ? 'Completed' : 'Pending'}
              </IonButton>
            </IonCol>
          </IonRow>

          <IonRow style={{ marginTop: '2rem' }}>
            <IonCol>
              <IonButton
                expand="block"
                onClick={handleSave}
                color="primary"
                disabled={!isOnline || !title.trim()}
              >
                <IonIcon icon={checkmark} slot="start" />
                Save Task
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default EditTask
