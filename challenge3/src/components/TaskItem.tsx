import { IonItem, IonLabel, IonButton, IonCheckbox, IonIcon } from '@ionic/react'
import { eye, trash } from 'ionicons/icons'

export interface Task {
  id: number
  title: string
  completed: boolean
}

interface TaskItemProps {
  task: Task
  onToggleComplete: (id: number) => void
  onDelete: (id: number) => void
  onViewDetail: (task: Task) => void
}

function TaskItem({ task, onToggleComplete, onDelete, onViewDetail }: TaskItemProps) {
  return (
    <IonItem>
      <IonCheckbox 
        slot="start"
        checked={task.completed}
        onIonChange={() => onToggleComplete(task.id)}
      />
      <IonLabel style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.6 : 1 }}>
        {task.title}
      </IonLabel>
      <IonButton 
        onClick={() => onViewDetail(task)}
        color="primary"
        slot="end"
        size="small"
      >
        <IonIcon icon={eye} />
      </IonButton>
      <IonButton 
        onClick={() => onDelete(task.id)}
        color="danger"
        slot="end"
        size="small"
      >
        <IonIcon icon={trash} />
      </IonButton>
    </IonItem>
  )
}

export default TaskItem
