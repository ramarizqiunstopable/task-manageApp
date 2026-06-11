import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskForm } from './TaskForm'

describe('TaskForm', () => {
  const mockOnAddTask = vi.fn()

  beforeEach(() => {
    mockOnAddTask.mockClear()
  })

  it('renders the input and submit button', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />)

    expect(screen.getByRole('textbox', { name: /task title/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /add task/i })).toBeDefined()
  })

  it('shows validation error when submitted with empty input', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    await user.click(screen.getByRole('button', { name: /add task/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
    })

    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  it('shows validation error for title shorter than 3 characters', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    await user.type(screen.getByRole('textbox', { name: /task title/i }), 'ab')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
    })

    expect(mockOnAddTask).not.toHaveBeenCalled()
  })

  it('calls onAddTask and resets the form on valid submission', async () => {
    const user = userEvent.setup()
    render(<TaskForm onAddTask={mockOnAddTask} />)

    const input = screen.getByRole('textbox', { name: /task title/i })
    await user.type(input, 'Buy groceries')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await waitFor(() => {
      expect(mockOnAddTask).toHaveBeenCalledOnce()
      expect(mockOnAddTask).toHaveBeenCalledWith('Buy groceries')
    })

    // Input should be cleared after submit
    expect((input as HTMLInputElement).value).toBe('')
  })

  it('disables the button when isLoading is true', () => {
    render(<TaskForm onAddTask={mockOnAddTask} isLoading={true} />)

    const button = screen.getByRole('button', { name: /add task/i })
    expect((button as HTMLButtonElement).disabled).toBe(true)
  })
})
