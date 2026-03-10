import React, { createContext, useState, useContext, ReactNode } from 'react'

//En el proyecto uso state navigation solo para pasar los details, pero el manejo de tareas se me hace más sencillo con un contexto, así que usé ambos para mostrar las diferentes formas de manejar los estados (la que ya conozco con el contexto y la nueva con el state navigation) 

export interface Task {
  id: number
  title: string
  completed: boolean
}

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Task) => void
  deleteTask: (id: number) => void
  toggleComplete: (id: number) => void
  setTasks: (tasks: Task[]) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

interface TaskProviderProps {
  children: ReactNode
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasksState] = useState<Task[]>([
    { id: 1, title: 'Complete challenge3', completed: false },
    { id: 2, title: 'Ask teacher for advices', completed: false },
    { id: 3, title: 'Go to the gym', completed: false }
  ])

  const addTask = (task: Task) => {
    setTasksState([...tasks, task])
  }

  const deleteTask = (id: number) => {
    setTasksState(tasks.filter(task => task.id !== id))
  }

  const toggleComplete = (id: number) => {
    setTasksState(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const setTasks = (newTasks: Task[]) => {
    setTasksState(newTasks)
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask, toggleComplete, setTasks }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTaskContext = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context
}
