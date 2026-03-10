import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonContent, IonInput, IonGrid, IonRow, IonCol, IonIcon, IonBackButton, IonButtons } from '@ionic/react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { checkmark, logOut } from 'ionicons/icons'
import { useTaskContext } from '../context/TaskContext'

const CreateTask: React.FC = () => {
  const history = useHistory()
  const { addTask } = useTaskContext()
  const [title, setTitle] = useState('')

  const handleAddTask = () => {
    if (title.trim()) {
      const newTask = {
        id: Date.now(),
        title,
        completed: false
      }
      addTask(newTask)
      setTitle('')
      history.push('/listing-task')
    }
  }

  const handleCancel = () => {
    history.goBack()
  }

  const handleLogout = () => {
    localStorage.removeItem('logged')
    localStorage.removeItem('userEmail')
    history.push('/login')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Create Task</IonTitle>
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
        <IonGrid style={{ marginTop: '2rem' }}>
          <IonRow>
            <IonCol>
              <IonInput
                type="text"
                placeholder="Enter task title..."
                value={title}
                onIonInput={(e) => setTitle(e.detail.value!)}
                fill="outline"
              />
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '2rem', gap: '1rem' }}>
            <IonCol>
              <IonButton
                expand="block"
                onClick={handleAddTask}
                color="primary"
              >
                <IonIcon icon={checkmark} slot="start" />
                Create Task
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                expand="block"
                onClick={handleCancel}
                color="medium"
              >
                Cancel
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default CreateTask
