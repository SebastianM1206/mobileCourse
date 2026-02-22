import { IonItem, IonLabel, IonButton, IonCheckbox } from '@ionic/react'

interface TaskItemProps {
  id: number
  title: string
  completed: boolean
  onToggleComplete: (id: number) => void
  onDelete: (id: number) => void
}

function TaskItem({ id, title, completed, onToggleComplete, onDelete }: TaskItemProps) {
  return (
    <IonItem>
      <IonCheckbox 
        slot="start"
        checked={completed}
        onIonChange={() => onToggleComplete(id)}
      />
      <IonLabel style={{ textDecoration: completed ? 'line-through' : 'none', opacity: completed ? 0.6 : 1 }}>
        {title}
      </IonLabel>
      <IonButton 
        onClick={() => onDelete(id)}
        color="danger"
        slot="end"
        size="small"
      >
        Delete
      </IonButton>
    </IonItem>
  )
}

export default TaskItem
