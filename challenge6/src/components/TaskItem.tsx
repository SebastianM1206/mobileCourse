import { IonItem, IonLabel, IonButton, IonCheckbox, IonIcon } from '@ionic/react'
import { eye, trash } from 'ionicons/icons'

export interface Task {
  id: string | number
  title: string
  completed: boolean
}

interface TaskItemProps {
  task: Task
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onViewDetail: (task: Task) => void
  isCrudEnabled: boolean
}

function TaskItem({ task, onToggleComplete, onDelete, onViewDetail, isCrudEnabled }: TaskItemProps) {
  return (
    <IonItem>
      <IonCheckbox 
        slot="start"
        checked={task.completed}
        onIonChange={() => onToggleComplete(String(task.id))}
        disabled={!isCrudEnabled}
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
        onClick={() => onDelete(String(task.id))}
        color="danger"
        slot="end"
        size="small"
        disabled={!isCrudEnabled}
      >
        <IonIcon icon={trash} />
      </IonButton>
    </IonItem>
  )
}

export default TaskItem
