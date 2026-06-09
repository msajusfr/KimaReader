import { useEffect, useState } from 'react'
import { sampleVocabulary } from '../data/sampleData'
import { storageService } from '../services/storageService'
import type { TranslationResult } from '../types/translation'
import type { VocabularyItem } from '../types/vocabulary'
import { createId } from '../utils/ids'

export const useVocabulary = () => {
  const [items, setItems] = useState<VocabularyItem[]>(() => {
    const stored = storageService.getVocabulary()
    return stored.length ? stored : sampleVocabulary
  })

  useEffect(() => {
    storageService.saveVocabulary(items)
  }, [items])

  const addFromTranslation = (translation: TranslationResult) => {
    setItems((current) => {
      const exists = current.some(
        (item) => item.greek.toLowerCase() === translation.sourceText.toLowerCase(),
      )
      if (exists) return current
      return [
        {
          id: createId('vocab'),
          greek: translation.sourceText,
          translation: translation.translation,
          context: translation.explanation,
          difficulty: 'review',
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]
    })
  }

  return { items, addFromTranslation }
}
