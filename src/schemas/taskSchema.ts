import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Task title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters')
    .trim(),
})

export type TaskFormValues = z.infer<typeof taskFormSchema>
