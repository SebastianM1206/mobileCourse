import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText } from '@ionic/react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { add, home, logOut } from 'ionicons/icons'
import TaskList from '../components/TaskList'
import Loader from '../components/Loader'
import { useTaskContext } from '../context/TaskContext'
import { useAuthContext } from '../context/AuthContext'
import useNetwork from '../hooks/useNetwork'

const ListingTask: React.FC = () => {
  const history = useHistory()
  const { tasks, deleteTask, toggleComplete } = useTaskContext()
  const { logout } = useAuthContext()
  const { isOnline } = useNetwork()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const handleToggleComplete = (id: string) => {
    if (!isOnline) return
    toggleComplete(id)
  }

  const handleDeleteTask = (id: string) => {
    if (!isOnline) return
    deleteTask(id)
  }

  const handleViewDetail = (task: any) => {
    history.push('/detail', { task })
  }

  const handleCreateTask = () => {
    history.push('/create-task')
  }

  const handleLogout = async () => {
    await logout()
    history.push('/login')
  }

  if (loading) {
    return <Loader />
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Manager</IonTitle>
          <IonButton
            slot="end"
            onClick={() => history.push('/home')}
            color="medium"
          >
            <IonIcon icon={home} />
          </IonButton>
          <IonButton
            slot="end"
            onClick={handleCreateTask}
            color="primary"
            disabled={!isOnline}
          >
            <IonIcon icon={add} />
          </IonButton>
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
        {!isOnline && (
          <IonText color="warning">
            <p>Offline: tasks quedan solo en lectura.</p>
          </IonText>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Tasks</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onViewDetail={handleViewDetail}
          isCrudEnabled={isOnline}
        />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  )
}

export default ListingTask
