import { describe, it, expect } from 'vitest'
import { filterTasks, getTaskCounts } from './filterTasks'
import type { Task } from '../types/task'

const mockTasks: Task[] = [
  { id: 1, title: 'Buy groceries', completed: false, userId: 1 },
  { id: 2, title: 'Write report', completed: true, userId: 1 },
  { id: 3, title: 'Call dentist', completed: false, userId: 1 },
  { id: 4, title: 'Read book', completed: true, userId: 1 },
]

describe('filterTasks', () => {
  it('returns all tasks when filter is "all"', () => {
    const result = filterTasks(mockTasks, 'all')
    expect(result).toHaveLength(4)
    expect(result).toEqual(mockTasks)
  })

  it('returns only completed tasks when filter is "completed"', () => {
    const result = filterTasks(mockTasks, 'completed')
    expect(result).toHaveLength(2)
    expect(result.every((t) => t.completed)).toBe(true)
  })

  it('returns only pending tasks when filter is "pending"', () => {
    const result = filterTasks(mockTasks, 'pending')
    expect(result).toHaveLength(2)
    expect(result.every((t) => !t.completed)).toBe(true)
  })

  it('returns all tasks for unknown filter type', () => {
    // @ts-expect-error — testing invalid input
    const result = filterTasks(mockTasks, 'invalid')
    expect(result).toHaveLength(4)
  })

  it('returns empty array when tasks list is empty', () => {
    expect(filterTasks([], 'all')).toEqual([])
    expect(filterTasks([], 'completed')).toEqual([])
    expect(filterTasks([], 'pending')).toEqual([])
  })
})

describe('getTaskCounts', () => {
  it('returns correct counts for all filters', () => {
    const counts = getTaskCounts(mockTasks)
    expect(counts.all).toBe(4)
    expect(counts.completed).toBe(2)
    expect(counts.pending).toBe(2)
  })

  it('returns zero counts for empty task list', () => {
    const counts = getTaskCounts([])
    expect(counts.all).toBe(0)
    expect(counts.completed).toBe(0)
    expect(counts.pending).toBe(0)
  })

  it('returns correct counts when all tasks are completed', () => {
    const allDone = mockTasks.map((t) => ({ ...t, completed: true }))
    const counts = getTaskCounts(allDone)
    expect(counts.completed).toBe(4)
    expect(counts.pending).toBe(0)
  })
})
