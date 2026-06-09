export type TranslationKind = 'word' | 'phrase' | 'paragraph'

export interface TranslationResult {
  id: string
  sourceText: string
  kind: TranslationKind
  translation: string
  transliteration?: string
  explanation: string
  createdAt: string
}
