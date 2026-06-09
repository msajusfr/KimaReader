export type ReaderTheme = 'dark' | 'light'

export interface BookChapter {
  title: string
  paragraphs: string[]
}

export interface BookContent {
  id: string
  title: string
  author: string
  cover: string
  sourceUrl: string
  chapters: BookChapter[]
}

export interface BookProgress {
  bookId: string
  chapterIndex: number
  progress: number
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
