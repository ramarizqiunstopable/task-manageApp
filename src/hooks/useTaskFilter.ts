import { useState, useMemo } from 'react'
import { filterTasks, getTaskCounts } from '../utils/filterTasks'
import type { Task, FilterType } from '../types/task'

export function useTaskFilter(tasks: Task[]) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filteredTasks = useMemo(
    () => filterTasks(tasks, activeFilter),
    [tasks, activeFilter]
  )

  const counts = useMemo(() => getTaskCounts(tasks), [tasks])

  return {
    activeFilter,
    setActiveFilter,
    filteredTasks,
    counts,
  }
}
