import type { AiSettings } from '../types/settings'
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

const jsonSchema = {
  name: 'greek_translation',
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      translation: { type: 'string' },
      transliteration: { type: 'string' },
      explanation: { type: 'string' },
    },
    required: ['translation', 'transliteration', 'explanation'],
  },
  strict: true,
}

const extractOutputText = (response: unknown) => {
  const maybe = response as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }
  if (maybe.output_text) return maybe.output_text
  return maybe.output
    ?.flatMap((item) => item.content ?? [])
    .map((item) => item.text)
    .filter(Boolean)
    .join('\n')
}

const translateWithOpenAi = async (
  text: string,
  settings: AiSettings,
): Promise<Pick<TranslationResult, 'translation' | 'transliteration' | 'explanation'>> => {
  if (!settings.openAiApiKey.trim()) {
    return {
      translation: 'Clé OpenAI manquante',
      transliteration: '',
      explanation:
        "Ajoutez votre clé API dans Configuration > OpenAI, ou repassez en mode Simulation.",
    }
  }

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${settings.openAiApiKey.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.openAiModel.trim() || 'gpt-5.4-mini',
      input: [
        {
          role: 'system',
          content:
            'Tu es un professeur de grec moderne pour francophones. Réponds uniquement en JSON conforme au schéma.',
        },
        {
          role: 'user',
          content: `Traduis ce texte grec moderne en français et donne une translittération simple si utile, puis une explication pédagogique très concise:\n\n${text}`,
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          ...jsonSchema,
        },
      },
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(detail || `OpenAI API error ${response.status}`)
  }

  const data = await response.json()
  const outputText = extractOutputText(data)
  if (!outputText) throw new Error('Réponse OpenAI vide')
  return JSON.parse(outputText) as Pick<
    TranslationResult,
    'translation' | 'transliteration' | 'explanation'
  >
}

export const translationService = {
  async translate(text: string, settings?: AiSettings): Promise<TranslationResult> {
    const normalized = text.trim()
    const key = normalized.toLocaleLowerCase('el-GR')
    const sample = examples[key]

    if (settings?.provider === 'openai') {
      try {
        const result = await translateWithOpenAi(normalized, settings)
        return {
          id: createId('translation'),
          sourceText: normalized,
          kind: classify(normalized),
          translation: result.translation,
          transliteration: result.transliteration || undefined,
          explanation: result.explanation,
          createdAt: new Date().toISOString(),
        }
      } catch (error) {
        return {
          id: createId('translation'),
          sourceText: normalized,
          kind: classify(normalized),
          translation: 'Erreur OpenAI',
          explanation:
            error instanceof Error
              ? error.message
              : "Impossible d'obtenir une traduction OpenAI.",
          createdAt: new Date().toISOString(),
        }
      }
    }

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
