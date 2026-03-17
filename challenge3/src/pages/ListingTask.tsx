import { IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonContent } from '@ionic/react'
import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { add, logOut } from 'ionicons/icons'
import TaskList from '../components/TaskList'
import Loader from '../components/Loader'
import { useTaskContext, Task } from '../context/TaskContext'
import { useAuthContext } from '../context/AuthContext'

const ListingTask: React.FC = () => {
  const history = useHistory()
  const { tasks, deleteTask, toggleComplete } = useTaskContext()
  const { logout } = useAuthContext()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const handleToggleComplete = (id: number) => {
    toggleComplete(id)
  }

  const handleDeleteTask = (id: number) => {
    deleteTask(id)
  }

  const handleViewDetail = (task: Task) => {
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
            onClick={handleCreateTask}
            color="primary"
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
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          onViewDetail={handleViewDetail}
        />
      </IonContent>
    </IonPage>
  )
}

export default ListingTask
