import { useState, useEffect } from 'react'
import { IonContent, IonTitle, IonInput, IonButton, IonGrid, IonRow, IonCol } from '@ionic/react'
import Loader from './Loader'
import TaskList from './TaskList'

export interface Task {
  id: number
  title: string
  completed: boolean
}

function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')

  useEffect(() => {
    setTimeout(() => {
      const initialTasks: Task[] = [
        { id: 1, title: 'Complete challenge3', completed: false },
        { id: 2, title: 'Ask teacher for advices my so', completed: false },
        { id: 3, title: 'Go to the gym', completed: false }
      ]
      setTasks(initialTasks)
      setLoading(false)
    }, 1500)
  }, [])

  const handleAddTask = () => {
    if (title.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title,
        completed: false
      }
      setTasks([...tasks, newTask])
      setTitle('')
    }
  }

  const handleToggleComplete = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleViewDetail = (task: Task) => {
    console.log('View detail:', task)
  }

  if (loading) {
    return <Loader />
  }

  return (
    <IonContent className="ion-padding">
      <IonTitle className="ion-text-center" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
        Task Manager
      </IonTitle>
      
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonInput 
              type="text" 
              placeholder="Enter a new task..." 
              value={title}
              onIonInput={(e) => setTitle(e.detail.value!)}
              fill="outline"
            />
          </IonCol>
          <IonCol size="auto">
            <IonButton 
              onClick={handleAddTask}
              color="primary"
            >
              Add Task
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>

      <TaskList 
        tasks={tasks} 
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTask}
        onViewDetail={handleViewDetail}
      />
    </IonContent>
  )
}

export default TaskApp
