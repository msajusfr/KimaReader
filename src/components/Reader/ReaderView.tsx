import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Library,
  Minus,
  Moon,
  Plus,
  Search,
  Sun,
  Volume2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { speechService } from '../../services/speechService'
import { translationService } from '../../services/translationService'
import type { BookContent, BookProgress, ReaderPreferences } from '../../types/book'
import type { AiSettings } from '../../types/settings'
import type { TranslationResult } from '../../types/translation'
import { TranslationPopover } from '../Translation/TranslationPopover'
import { IconButton } from '../UI/IconButton'

interface Props {
  book: BookContent
  progress: BookProgress
  preferences: ReaderPreferences
  onPreferencesChange: (preferences: ReaderPreferences) => void
  onBack: () => void
  onProgressChange: (progress: BookProgress) => void
  onSaveVocabulary: (result: TranslationResult) => void
  aiSettings: AiSettings
  onOpenSettings: () => void
}

export const ReaderView = ({
  book,
  progress,
  preferences,
  onPreferencesChange,
  onBack,
  onProgressChange,
  onSaveVocabulary,
  aiSettings,
  onOpenSettings,
}: Props) => {
  const [selectedText, setSelectedText] = useState('')
  const [translation, setTranslation] = useState<TranslationResult>()
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const [query, setQuery] = useState('')
  const activeChapterIndex = Math.min(progress.chapterIndex, book.chapters.length - 1)
  const activeChapter = book.chapters[activeChapterIndex]
  const surfaceClass = preferences.theme === 'dark' ? 'bg-[#111827] text-slate-100' : 'bg-[#f7f1e7] text-slate-900'

  const readerStyles = useMemo(
    () => ({
      maxWidth: `${preferences.readingWidth}px`,
      fontSize: `${preferences.fontSize}px`,
    }),
    [preferences.fontSize, preferences.readingWidth],
  )

  const translateText = (text: string) => {
    const normalized = text.trim()
    if (!normalized) return
    setSelectedText(normalized)
    setLoadingTranslation(true)
    setTranslation(undefined)
    translationService.translate(normalized, aiSettings).then((result) => {
      setTranslation(result)
      setLoadingTranslation(false)
    })
  }

  const updateChapter = (chapterIndex: number) => {
    const bounded = Math.min(Math.max(chapterIndex, 0), book.chapters.length - 1)
    onProgressChange({
      bookId: book.id,
      chapterIndex: bounded,
      progress: Math.round(((bounded + 1) / book.chapters.length) * 100),
      lastOpenedAt: new Date().toISOString(),
    })
  }

  const handleParagraphPointerUp = (paragraph: string) => {
    const selection = window.getSelection()?.toString().trim()
    translateText(selection || paragraph)
  }

  const updatePreferences = (next: Partial<ReaderPreferences>) =>
    onPreferencesChange({ ...preferences, ...next })

  const searchInBook = () => translateText(query)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09111d]/72 px-3 py-3 backdrop-blur-2xl sm:px-5">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <IconButton label="Bibliothèque" onClick={onBack}>
            <Library size={18} />
          </IconButton>
          <div className="min-w-0 flex-1 px-1">
            <h1 className="truncate text-sm font-semibold text-white sm:text-base">{book.title}</h1>
            <p className="truncate text-xs text-slate-400">{book.author}</p>
          </div>
          <IconButton label="Diminuer la taille" onClick={() => updatePreferences({ fontSize: Math.max(16, preferences.fontSize - 1) })}>
            <Minus size={17} />
          </IconButton>
          <IconButton label="Augmenter la taille" onClick={() => updatePreferences({ fontSize: Math.min(28, preferences.fontSize + 1) })}>
            <Plus size={17} />
          </IconButton>
          <IconButton label="Mode clair ou sombre" onClick={() => updatePreferences({ theme: preferences.theme === 'dark' ? 'light' : 'dark' })}>
            {preferences.theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
          </IconButton>
          <IconButton label="Configuration OpenAI" onClick={onOpenSettings} active={aiSettings.provider === 'openai'}>
            <KeyRound size={17} />
          </IconButton>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 gap-4 px-3 py-4 lg:grid-cols-[1fr_280px] lg:px-5">
        <section className="min-w-0">
          <div className="mb-3 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-2 backdrop-blur-xl">
            <Search size={16} className="text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && searchInBook()}
              placeholder="Traduire ou rechercher une expression"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button type="button" onClick={searchInBook} className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/14">
              OK
            </button>
          </div>

          <article className="mx-auto transition-all duration-300" style={readerStyles}>
            <div className={`reader-surface h-[calc(100vh-170px)] min-h-[520px] overflow-auto rounded-[30px] border border-white/10 ${surfaceClass} p-6 shadow-2xl shadow-black/30 sm:p-10`}>
              <p className="text-xs uppercase tracking-[0.22em] text-[#c8a96a]">
                {activeChapter.title}
              </p>
              <h2 className="mt-3 break-words font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                {book.title}
              </h2>
              <p className="mt-2 text-base text-slate-400">{book.author}</p>
              <div className="mt-8 space-y-6 font-serif leading-[1.78]">
                {activeChapter.paragraphs.map((paragraph, index) => (
                  <p
                    key={`${activeChapter.title}-${index}`}
                    onPointerUp={() => handleParagraphPointerUp(paragraph)}
                    className="cursor-text break-words rounded-2xl px-1 py-1 transition hover:bg-[#c8a96a]/10"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>

          <div className="mx-auto mt-3 flex max-w-[760px] items-center justify-between">
            <IconButton label="Chapitre précédent" onClick={() => updateChapter(activeChapterIndex - 1)}>
              <ChevronLeft size={20} />
            </IconButton>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bookmark size={14} className="text-[#c8a96a]" />
              {progress.progress}% lu
            </div>
            <IconButton label="Chapitre suivant" onClick={() => updateChapter(activeChapterIndex + 1)}>
              <ChevronRight size={20} />
            </IconButton>
          </div>
        </section>

        <aside className="hidden space-y-3 lg:block">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c8a96a]">Chapitres</p>
            <div className="mt-4 space-y-2">
              {book.chapters.map((chapter, index) => (
                <button
                  key={chapter.title}
                  type="button"
                  onClick={() => updateChapter(index)}
                  className={`w-full rounded-2xl px-3 py-2 text-left text-sm transition ${
                    index === activeChapterIndex
                      ? 'bg-[#c8a96a] text-[#15120b]'
                      : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]'
                  }`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#c8a96a]">Lecture</p>
            <label className="mt-4 block text-xs text-slate-400">
              Largeur
              <input
                type="range"
                min="560"
                max="920"
                value={preferences.readingWidth}
                onChange={(event) => updatePreferences({ readingWidth: Number(event.target.value) })}
                className="mt-2 w-full accent-[#c8a96a]"
              />
            </label>
            <button type="button" onClick={() => speechService.speak(selectedText || activeChapter.paragraphs.join(' '))} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/14">
              <Volume2 size={16} /> Lire la sélection
            </button>
            <button type="button" onClick={onOpenSettings} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c8a96a] px-4 py-2 text-sm font-medium text-[#15120b] hover:bg-[#d8bd80]">
              <KeyRound size={16} /> API traduction
            </button>
          </div>
        </aside>
      </div>

      {selectedText ? (
        <TranslationPopover
          selectedText={selectedText}
          result={translation}
          loading={loadingTranslation}
          onClose={() => setSelectedText('')}
          onSpeak={(text) => speechService.speak(text)}
          onSave={onSaveVocabulary}
        />
      ) : null}
    </div>
  )
}
