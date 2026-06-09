export type TranslationProvider = 'mock' | 'openai'

export interface AiSettings {
  provider: TranslationProvider
  openAiApiKey: string
  openAiModel: string
}
