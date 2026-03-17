import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonContent, IonBackButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonCheckbox, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonButtons } from '@ionic/react'
import { useLocation, useHistory } from 'react-router-dom'
import { pencil, trash, logOut } from 'ionicons/icons'
import { useTaskContext, Task } from '../context/TaskContext'
import { useAuthContext } from '../context/AuthContext'

interface LocationState {
  task?: Task
}

const Detail: React.FC = () => {
  const location = useLocation<LocationState>()
  const history = useHistory()
  const { deleteTask } = useTaskContext()
  const { logout } = useAuthContext()
  const task = location.state?.task

  const handleLogout = async () => {
    await logout()
    history.push('/login')
  }

  if (!task) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonBackButton defaultHref="/listing-task" style={{ fontSize: '1.5rem', padding: '8px' }} />
            <IonTitle>Task Detail</IonTitle>
            <IonButton
              slot="end"
              onClick={handleLogout}
              color="danger"
            >
              <IonIcon icon={logOut} />
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="danger">
            <p className="ion-text-center">Task not found</p>
          </IonText>
        </IonContent>
      </IonPage>
    )
  }

  const handleDelete = () => {
    deleteTask(task.id)
    history.push('/listing-task')
  }

  const handleGoBack = () => {
    history.goBack()
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Task Detail</IonTitle>
          <IonButton
            slot="end"
            onClick={handleLogout}
            color="danger"
          >
            <IonIcon icon={logOut} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard style={{ marginTop: '2rem' }}>
          <IonCardHeader>
            <IonCardTitle>{task.title}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="none" style={{ marginBottom: '1rem' }}>
              <IonLabel>
                <strong>ID:</strong> {task.id}
              </IonLabel>
            </IonItem>
            <IonItem lines="none" style={{ marginBottom: '1rem' }}>
              <IonLabel style={{ marginRight: '1rem' }}>
                <strong>Status:</strong>
              </IonLabel>
              <IonCheckbox
                checked={task.completed}
                disabled
                style={{ marginLeft: 'auto' }}
              />
              <IonLabel style={{ marginLeft: '0.5rem' }}>
                {task.completed ? 'Completed' : 'Pending'}
              </IonLabel>
            </IonItem>

            <IonGrid style={{ marginTop: '2rem' }}>
              <IonRow style={{ gap: '1rem' }}>
                <IonCol>
                  <IonButton expand="block" color="primary" onClick={handleGoBack}>
                    <IonIcon icon={pencil} slot="start" />
                    Edit
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton expand="block" color="danger" onClick={handleDelete}>
                    <IonIcon icon={trash} slot="start" />
                    Delete
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default Detail
