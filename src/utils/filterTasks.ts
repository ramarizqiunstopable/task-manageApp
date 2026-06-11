import type { Task, FilterType } from '../types/task'

export function filterTasks(tasks: Task[], filter: FilterType): Task[] {
  switch (filter) {
    case 'completed':
      return tasks.filter((task) => task.completed)
    case 'pending':
      return tasks.filter((task) => !task.completed)
    case 'all':
    default:
      return tasks
  }
}

export function getTaskCounts(tasks: Task[]): Record<FilterType, number> {
  return {
    all: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
  }
}
