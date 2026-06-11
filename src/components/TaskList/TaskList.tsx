import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Task } from '../../types/task'
import type { FilterType } from '../../types/task'
import { TaskItem } from '../TaskItem/TaskItem'
import { Spinner } from '../ui/Spinner'
import { EmptyState } from '../ui/EmptyState'
import { Button } from '../ui/Button'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  isError: boolean
  activeFilter: FilterType
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
  onRetry: () => void
  hasNextPage?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
}

export function TaskList({
  tasks,
  isLoading,
  isError,
  activeFilter,
  onToggle,
  onDelete,
  onRetry,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: TaskListProps) {
  const { ref, inView } = useInView()

  useEffect(() => {
    if (inView && hasNextPage && fetchNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])
  if (isLoading) {
    return (
      <div className="task-list task-list--center">
        <Spinner size="lg" label="Loading tasks..." />
        <p className="task-list__loading-text">Fetching your tasks...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="task-list task-list--center task-list--error">
        <span className="task-list__error-icon" aria-hidden="true">⚠️</span>
        <p className="task-list__error-text">
          Failed to load tasks. Please try again.
        </p>
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--center">
        <EmptyState filter={activeFilter} />
      </div>
    )
  }

  return (
    <ul
      className="task-list"
      aria-label="Task list"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
      {hasNextPage && (
        <div ref={ref} className="task-list__loading-more">
          {isFetchingNextPage ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
              <Spinner size="sm" label="Loading more tasks..." />
            </div>
          ) : null}
        </div>
      )}
    </ul>
  )
}
