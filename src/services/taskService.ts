import type { Task, NewTaskPayload } from '../types/task'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

export async function fetchTasks({ pageParam = 1 }: { pageParam?: number }): Promise<Task[]> {
  const response = await fetch(`${BASE_URL}/todos?_page=${pageParam}&_limit=10`)
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`)
  }
  return response.json() as Promise<Task[]>
}

export async function createTask(payload: NewTaskPayload): Promise<Task> {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`)
  }
  return response.json() as Promise<Task>
}

export async function updateTask(
  id: number,
  data: Partial<Task>
): Promise<Task> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`)
  }
  return response.json() as Promise<Task>
}

export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`)
  }
}
