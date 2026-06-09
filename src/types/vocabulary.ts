export type Difficulty = 'easy' | 'review' | 'hard'

export interface VocabularyItem {
  id: string
  greek: string
  translation: string
  context?: string
  difficulty: Difficulty
  createdAt: string
}
