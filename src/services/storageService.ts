import type { BookProgress, ReaderPreferences, ReadingSession } from '../types/book'
import type { AiSettings } from '../types/settings'
import type { TranslationResult } from '../types/translation'
import type { VocabularyItem } from '../types/vocabulary'

const keys = {
  bookProgresses: 'kima.bookProgresses',
  preferences: 'kima.preferences',
  vocabulary: 'kima.vocabulary',
  translations: 'kima.translations',
  session: 'kima.session',
  aiSettings: 'kima.aiSettings',
}

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const write = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storageService = {
  getBookProgresses: () => read<BookProgress[]>(keys.bookProgresses, []),
  saveBookProgresses: (progresses: BookProgress[]) =>
    write(keys.bookProgresses, progresses),
  getPreferences: () =>
    read<ReaderPreferences>(keys.preferences, {
      theme: 'dark',
      fontSize: 20,
      readingWidth: 760,
    }),
  savePreferences: (preferences: ReaderPreferences) =>
    write(keys.preferences, preferences),
  getVocabulary: () => read<VocabularyItem[]>(keys.vocabulary, []),
  saveVocabulary: (items: VocabularyItem[]) => write(keys.vocabulary, items),
  getTranslations: () => read<TranslationResult[]>(keys.translations, []),
  saveTranslations: (items: TranslationResult[]) =>
    write(keys.translations, items.slice(0, 60)),
  getSession: () => read<ReadingSession>(keys.session, { history: [] }),
  saveSession: (session: ReadingSession) => write(keys.session, session),
  getAiSettings: () =>
    read<AiSettings>(keys.aiSettings, {
      provider: 'mock',
      openAiApiKey: '',
      openAiModel: 'gpt-5.4-mini',
    }),
  saveAiSettings: (settings: AiSettings) => write(keys.aiSettings, settings),
}
