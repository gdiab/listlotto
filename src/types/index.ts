// User types
export interface User {
  id: string
  name: string
  email: string
  photoUrl?: string
}

// List item types
export interface ListItem {
  id: string
  text: string
  createdAt: number
  weight?: number // Default is 1 when undefined
}

// List types
export interface List {
  id: string
  title: string
  items: ListItem[]
  createdAt: number
  updatedAt: number
  isArchived: boolean
  useWeights?: boolean // When true, item weights affect randomization
}

// Context types
export interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isGuest: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  continueAsGuest: () => void
}

export interface ListsContextType {
  lists: List[]
  getList: (id: string) => List | undefined
  createList: (title: string) => List
  updateList: (id: string, updates: Partial<Omit<List, 'id'>>) => void
  deleteList: (id: string) => void
  addItem: (listId: string, text: string) => void
  updateItem: (listId: string, itemId: string, text: string) => void
  removeItem: (listId: string, itemId: string) => void
  reorderItems: (listId: string, startIndex: number, endIndex: number) => void
  archiveList: (id: string) => void
  unarchiveList: (id: string) => void
  getRandomItem: (listId: string) => ListItem | null
  // Weight management
  updateItemWeight: (listId: string, itemId: string, weight: number) => void
  toggleUseWeights: (listId: string) => void
  resetWeights: (listId: string) => void
}

// Component prop types
export interface ListCardProps {
  list: List
  onArchive: (id: string) => void
  onUnarchive: (id: string) => void
  onDelete: (id: string) => void
}

export interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

// Animation types
export interface AnimationConfig {
  duration: number
  easing: string
  stages: AnimationStage[]
}

export interface AnimationStage {
  name: string
  duration: number
  animation: Record<string, string | number | string[]>
}

// Utility types
export type Theme = 'light' | 'dark'
export type CreateListDto = Pick<List, 'title'>
export type UpdateListDto = Partial<Omit<List, 'id' | 'createdAt'>>
export type CreateItemDto = Pick<ListItem, 'text'>