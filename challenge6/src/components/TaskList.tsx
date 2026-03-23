import { IonList, IonText, IonListHeader, IonLabel } from '@ionic/react'
import TaskItem from './TaskItem'

export interface Task {
  id: string | number
  title: string
  completed: boolean
}

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onViewDetail: (task: Task) => void
  isCrudEnabled: boolean
}

function TaskList({ tasks, onToggleComplete, onDelete, onViewDetail, isCrudEnabled }: TaskListProps) {
  const activeTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <>
      <IonListHeader>
        <IonLabel>Active Tasks ({activeTasks.length})</IonLabel>
      </IonListHeader>
      {activeTasks.length === 0 ? (
        <IonText color="medium" className="ion-padding">
          No active tasks
        </IonText>
      ) : (
        <IonList>
          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onViewDetail={onViewDetail}
              isCrudEnabled={isCrudEnabled}
            />
          ))}
        </IonList>
      )}

      {completedTasks.length > 0 && (
        <>
          <IonListHeader style={{ marginTop: '1rem' }}>
            <IonLabel>Completed Tasks ({completedTasks.length})</IonLabel>
          </IonListHeader>
          <IonList>
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onViewDetail={onViewDetail}
                isCrudEnabled={isCrudEnabled}
              />
            ))}
          </IonList>
        </>
      )}
    </>
  )
}

export default TaskList
