import { useState, useCallback } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../services/taskService'
import type { Task } from '../types/task'

export const TASKS_QUERY_KEY = ['tasks'] as const

let localIdCounter = -1

export function useTasks() {
  const queryClient = useQueryClient()

  const [localOverrides, setLocalOverrides] = useState<Map<number, Task>>(
    new Map()
  )
  const [localNew, setLocalNew] = useState<Task[]>([])
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set())

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchTasks({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length + 1 : undefined
    },
    staleTime: 1000 * 60 * 5,
  })

  const serverTasks = data?.pages.flatMap((page) => page) ?? []

  // Merged task list: new locals (prepended) + server (with overrides applied) - deleted
  const tasks: Task[] = [
    ...localNew.filter((t) => !deletedIds.has(t.id)),
    ...serverTasks
      .filter((t) => !deletedIds.has(t.id))
      .map((t) => localOverrides.get(t.id) ?? t),
  ]

  // --- Add Task ---
  const addMutation = useMutation({
    mutationFn: (title: string) =>
      createTask({ title, userId: 1, completed: false }),
    onMutate: (title: string) => {
      const tempId = localIdCounter--
      const optimistic: Task = { id: tempId, title, userId: 1, completed: false }
      setLocalNew((prev) => [optimistic, ...prev])
      return { tempId }
    },
    onSuccess: (serverTask, _vars, context) => {
      // Swap temp task with server-returned task
      setLocalNew((prev) =>
        prev.map((t) =>
          t.id === context?.tempId ? { ...serverTask } : t
        )
      )
      toast.success('Task successfully added!')
    },
    onError: (_err, _vars, context) => {
      setLocalNew((prev) => prev.filter((t) => t.id !== context?.tempId))
      toast.error('Failed to add task.')
    },
  })

  // --- Toggle Task ---
  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      updateTask(id, { completed }),
    onMutate: ({ id, completed }) => {
      const base =
        localNew.find((t) => t.id === id) ??
        localOverrides.get(id) ??
        serverTasks.find((t) => t.id === id)
      if (!base) return { previous: null, id }
      const updated = { ...base, completed }
      const isNew = localNew.some((t) => t.id === id)
      if (isNew) {
        setLocalNew((prev) => prev.map((t) => (t.id === id ? updated : t)))
      } else {
        setLocalOverrides((prev) => new Map(prev).set(id, updated))
      }
      return { previous: base, id }
    },
    onSuccess: (_data, vars) => {
      toast.success(`Task marked as ${vars.completed ? 'completed' : 'pending'}.`)
    },
    onError: (_err, _vars, context) => {
      if (!context?.previous) return
      const { id, previous } = context
      const isNew = localNew.some((t) => t.id === id)
      if (isNew) {
        setLocalNew((prev) => prev.map((t) => (t.id === id ? previous : t)))
      } else {
        setLocalOverrides((prev) => new Map(prev).set(id, previous))
      }
      toast.error('Failed to update task status.')
    },
  })

  // --- Delete Task ---
  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      // For locally-created tasks (negative IDs), skip the API call
      if (id < 0) return Promise.resolve()
      return deleteTask(id)
    },
    onMutate: (id: number) => {
      setDeletedIds((prev) => new Set([...prev, id]))
      return { id }
    },
    onError: (_err, _vars, context) => {
      if (!context?.id) return
      setDeletedIds((prev) => {
        const next = new Set(prev)
        next.delete(context.id)
        return next
      })
      toast.error('Failed to delete task.')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
      toast.success('Task successfully deleted!')
    },
  })

  const addTask = useCallback(
    (title: string) => addMutation.mutate(title),
    [addMutation]
  )

  const toggleTask = useCallback(
    (id: number, completed: boolean) => toggleMutation.mutate({ id, completed }),
    [toggleMutation]
  )

  const removeTask = useCallback(
    (id: number) => deleteMutation.mutate(id),
    [deleteMutation]
  )

  return {
    tasks,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    addTask,
    toggleTask,
    removeTask,
    isAdding: addMutation.isPending,
  }
}
