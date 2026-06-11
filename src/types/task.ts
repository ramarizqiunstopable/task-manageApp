export type FilterType = 'all' | 'completed' | 'pending'

export interface Task {
  id: number
  title: string
  completed: boolean
  userId: number
}

export interface NewTaskPayload {
  title: string
  userId: number
  completed: boolean
}
