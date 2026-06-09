import type { BookRecord } from '../types/book'
import type { VocabularyItem } from '../types/vocabulary'

export const defaultBooks: BookRecord[] = [
  {
    id: 'default-ta-psila-vouna',
    title: 'Τα ψηλά βουνά',
    author: 'Ζαχαρίας Παπαντωνίου',
    fileName: 'ta-psila-vouna.epub',
    dataUrl: '/books/ta-psila-vouna.epub',
    coverUrl: '/books/ta-psila-vouna-cover.svg',
    progress: 0,
    importedAt: new Date('2026-06-09T00:00:00.000Z').toISOString(),
  },
]

export const sampleVocabulary: VocabularyItem[] = [
  {
    id: 'sample-1',
    greek: 'καλημέρα',
    translation: 'bonjour',
    context: 'Expression de salutation.',
    difficulty: 'easy',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    greek: 'θάλασσα',
    translation: 'mer',
    context: 'Souvent présent dans les textes narratifs grecs.',
    difficulty: 'review',
    createdAt: new Date().toISOString(),
  },
]
