import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react'
import useRealtimeCollection from '../hooks/useRealtimeCollection'
import useNetwork from '../hooks/useNetwork'

//En el proyecto uso state navigation solo para pasar los details, pero el manejo de tareas se me hace más sencillo con un contexto, así que usé ambos para mostrar las diferentes formas de manejar los estados (la que ya conozco con el contexto y la nueva con el state navigation) 

export interface Task {
  id: string
  title: string
  completed: boolean
}

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id'>) => Promise<boolean>
  deleteTask: (id: string) => Promise<boolean>
  toggleComplete: (id: string) => Promise<boolean>
  updateTask: (id: string, title: string, completed: boolean) => Promise<boolean>
  isPending: boolean
  error: string | null
  isOnline: boolean
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

interface TaskProviderProps {
  children: ReactNode
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasksState] = useState<Task[]>([])
  const { results, isPending, error, add, update, deleteDoc } = useRealtimeCollection('tasks')
  const { isOnline } = useNetwork()

  useEffect(() => {
    const formattedTasks: Task[] = (results || []).map((task: any) => ({
      id: task.id,
      title: task.title ?? '',
      completed: Boolean(task.completed)
    }))

    setTasksState(formattedTasks)
  }, [results])

  const addTask = async (task: Omit<Task, 'id'>) => {
    if (!isOnline) return false

    const created = await add({
      title: task.title,
      completed: task.completed
    })

    return !!created
  }

  const deleteTask = async (id: string) => {
    if (!isOnline) return false
    return deleteDoc(id)
  }

  const toggleComplete = async (id: string) => {
    if (!isOnline) return false

    const currentTask = tasks.find((task) => task.id === id)
    if (!currentTask) return false

    return update(id, {
      title: currentTask.title,
      completed: !currentTask.completed
    })
  }

  const updateTask = async (id: string, title: string, completed: boolean) => {
    if (!isOnline) return false

    return update(id, {
      title,
      completed
    })
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, toggleComplete, updateTask, isPending, error, isOnline }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTaskContext = () => { //El useContext que normalmente se tira por comodidad, pero en este caso chapeto me dice que hay que tener cuidado con los errores si se usa fuera del provider 
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}
