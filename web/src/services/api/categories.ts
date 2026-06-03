import { api } from './client'

export type CategoryResponse = {
  id: string
  name: string
  slug: string
}

export const categoriesApi = {
  list: () => api.get<CategoryResponse[]>('/api/v1/categories'),
}
