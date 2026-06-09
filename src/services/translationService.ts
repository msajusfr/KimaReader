import type { TranslationKind, TranslationResult } from '../types/translation'
import { createId } from '../utils/ids'

const examples: Record<string, Partial<TranslationResult>> = {
  καλημέρα: {
    translation: 'bonjour',
    transliteration: 'kalimera',
    explanation: 'Salutation courante utilisée le matin et en début de journée.',
  },
  θάλασσα: {
    translation: 'mer',
    transliteration: 'thalassa',
    explanation: 'Nom féminin très fréquent, souvent employé avec l’article η.',
  },
  σπίτι: {
    translation: 'maison',
    transliteration: 'spiti',
    explanation: 'Nom neutre. En contexte, peut aussi suggérer le foyer.',
  },
}

const classify = (text: string): TranslationKind => {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 1) return 'word'
  if (words.length <= 12) return 'phrase'
  return 'paragraph'
}

export const translationService = {
  async translate(text: string): Promise<TranslationResult> {
    const normalized = text.trim()
    const key = normalized.toLocaleLowerCase('el-GR')
    const sample = examples[key]

    await new Promise((resolve) => window.setTimeout(resolve, 420 + Math.random() * 520))

    return {
      id: createId('translation'),
      sourceText: normalized,
      kind: classify(normalized),
      translation:
        sample?.translation ??
        `Traduction simulée de « ${normalized.slice(0, 120)}${normalized.length > 120 ? '...' : ''} »`,
      transliteration: sample?.transliteration,
      explanation:
        sample?.explanation ??
        "Mock pédagogique : cette zone est prête pour une réponse contextualisée d'OpenAI, Claude, Gemini ou Ollama.",
      createdAt: new Date().toISOString(),
    }
  },
}
