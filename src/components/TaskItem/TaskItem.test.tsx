import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskItem } from './TaskItem'
import type { Task } from '../../types/task'

const mockPendingTask: Task = {
  id: 1,
  title: 'Buy groceries',
  completed: false,
  userId: 1,
}

const mockCompletedTask: Task = {
  id: 2,
  title: 'Write report',
  completed: true,
  userId: 1,
}

describe('TaskItem', () => {
  const mockOnToggle = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    mockOnToggle.mockClear()
    mockOnDelete.mockClear()
  })

  it('renders the task title', () => {
    render(
      <TaskItem
        task={mockPendingTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Buy groceries')).toBeDefined()
  })

  it('renders an unchecked checkbox for pending tasks', () => {
    render(
      <TaskItem
        task={mockPendingTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.checked).toBe(false)
  })

  it('renders a checked checkbox for completed tasks', () => {
    render(
      <TaskItem
        task={mockCompletedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement
    expect(checkbox.checked).toBe(true)
  })

  it('calls onToggle with correct arguments when checkbox is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TaskItem
        task={mockPendingTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole('checkbox'))
    expect(mockOnToggle).toHaveBeenCalledOnce()
    expect(mockOnToggle).toHaveBeenCalledWith(1, true)
  })

  it('calls onDelete with the correct task id when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TaskItem
        task={mockPendingTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole('button', { name: /delete task/i }))
    expect(mockOnDelete).toHaveBeenCalledOnce()
    expect(mockOnDelete).toHaveBeenCalledWith(1)
  })

  it('applies the completed class when task is completed', () => {
    const { container } = render(
      <TaskItem
        task={mockCompletedTask}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const listItem = container.querySelector('li')
    expect(listItem?.className).toContain('task-item--completed')
  })
})
