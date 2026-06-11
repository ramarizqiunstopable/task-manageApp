import type { Task } from '../../types/task'

interface TaskItemProps {
  task: Task
  onToggle: (id: number, completed: boolean) => void
  onDelete: (id: number) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const handleToggle = () => {
    onToggle(task.id, !task.completed)
  }

  const handleDelete = () => {
    onDelete(task.id)
  }

  return (
    <li
      className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-item__body">
        <label className="task-item__checkbox-label">
          <input
            id={`task-checkbox-${task.id}`}
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            onChange={handleToggle}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <span className="task-item__checkmark" aria-hidden="true">
            {task.completed && (
              <svg viewBox="0 0 12 10" fill="none" aria-hidden="true">
                <polyline
                  points="1.5,5 4.5,8 10.5,2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
        </label>

        <span
          className="task-item__title"
          title={task.title}
        >
          {task.title}
        </span>
      </div>

      <button
        id={`task-delete-${task.id}`}
        className="task-item__delete"
        onClick={handleDelete}
        aria-label={`Delete task: ${task.title}`}
        title="Delete task"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  )
}
