import type { VocabularyItem } from '../types/vocabulary'

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
