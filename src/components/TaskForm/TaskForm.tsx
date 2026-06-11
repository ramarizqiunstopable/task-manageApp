import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskFormSchema, type TaskFormValues } from '../../schemas/taskSchema'
import { Button } from '../ui/Button'

interface TaskFormProps {
  onAddTask: (title: string) => void
  isLoading?: boolean
}

export function TaskForm({ onAddTask, isLoading = false }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    mode: 'onSubmit',
  })

  const onSubmit = (data: TaskFormValues) => {
    onAddTask(data.title)
    reset()
  }

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Add new task"
    >
      <div className="task-form__field">
        <div className="task-form__input-row">
          <input
            id="task-title-input"
            className={`task-form__input ${errors.title ? 'task-form__input--error' : ''}`}
            type="text"
            placeholder="Add a new task..."
            aria-label="Task title"
            aria-describedby={errors.title ? 'task-title-error' : undefined}
            aria-invalid={!!errors.title}
            autoComplete="off"
            {...register('title')}
          />
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            aria-label="Add task"
          >
            <span className="btn__add-icon" aria-hidden="true">+</span>
            <span>Add Task</span>
          </Button>
        </div>
        {errors.title && (
          <p
            id="task-title-error"
            className="task-form__error"
            role="alert"
            aria-live="polite"
          >
            {errors.title.message}
          </p>
        )}
      </div>
    </form>
  )
}
