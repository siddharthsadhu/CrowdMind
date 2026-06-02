import { z } from 'zod'

export const questionSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long'),
  context: z.string().min(20, 'Provide more context').max(5000).optional(),
  category: z.string().min(1, 'Select a category'),
})

export const discussionSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200),
  content: z.string().min(20, 'Provide more detail').max(10000).optional(),
})

export const replySchema = z.object({
  content: z.string().min(1, 'Reply cannot be empty').max(10000),
})

export type QuestionFormData = z.infer<typeof questionSchema>
export type DiscussionFormData = z.infer<typeof discussionSchema>
export type ReplyFormData = z.infer<typeof replySchema>
