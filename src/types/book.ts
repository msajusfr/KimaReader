export type ReaderTheme = 'dark' | 'light'

export interface BookRecord {
  id: string
  title: string
  author: string
  fileName: string
  dataUrl: string
  coverUrl?: string
  progress: number
  currentLocation?: string
  importedAt: string
  lastOpenedAt?: string
}

export interface ReaderPreferences {
  theme: ReaderTheme
  fontSize: number
  readingWidth: number
}

export interface ReadingSession {
  lastBookId?: string
  history: Array<{
    bookId: string
    title: string
    openedAt: string
  }>
}
