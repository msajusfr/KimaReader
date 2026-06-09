import ePub from 'epubjs'
import { Bookmark, ChevronLeft, ChevronRight, KeyRound, Library, Minus, Moon, Plus, Search, Sun, Volume2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { IconButton } from '../UI/IconButton'
import { TranslationPopover } from '../Translation/TranslationPopover'
import type { BookRecord, ReaderPreferences } from '../../types/book'
import type { AiSettings } from '../../types/settings'
import type { TranslationResult } from '../../types/translation'
import { epubService } from '../../services/epubService'
import { speechService } from '../../services/speechService'
import { translationService } from '../../services/translationService'

interface Props {
  book: BookRecord
  preferences: ReaderPreferences
  onPreferencesChange: (preferences: ReaderPreferences) => void
  onBack: () => void
  onBookUpdate: (book: BookRecord) => void
  onSaveVocabulary: (result: TranslationResult) => void
  aiSettings: AiSettings
  onOpenSettings: () => void
}

export const ReaderView = ({
  book,
  preferences,
  onPreferencesChange,
  onBack,
  onBookUpdate,
  onSaveVocabulary,
  aiSettings,
  onOpenSettings,
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const renditionRef = useRef<ReturnType<ReturnType<typeof ePub>['renderTo']> | null>(null)
  const epubRef = useRef<ReturnType<typeof ePub> | null>(null)
  const bookRef = useRef(book)
  const preferencesRef = useRef(preferences)
  const aiSettingsRef = useRef(aiSettings)
  const onBookUpdateRef = useRef(onBookUpdate)
  const [selectedText, setSelectedText] = useState('')
  const [translation, setTranslation] = useState<TranslationResult>()
  const [loadingTranslation, setLoadingTranslation] = useState(false)
  const [query, setQuery] = useState('')
  const surfaceClass = preferences.theme === 'dark' ? 'bg-[#111827]' : 'bg-[#f7f1e7]'

  useEffect(() => {
    bookRef.current = book
    preferencesRef.current = preferences
    aiSettingsRef.current = aiSettings
    onBookUpdateRef.current = onBookUpdate
  }, [aiSettings, book, onBookUpdate, preferences])

  const readerStyles = useMemo(
    () => ({
      maxWidth: `${preferences.readingWidth}px`,
    }),
    [preferences.readingWidth],
  )

  useEffect(() => {
    let cancelled = false

    const boot = async () => {
      if (!containerRef.current) return
      const arrayBuffer = await epubService.dataUrlToArrayBuffer(bookRef.current.dataUrl)
      if (cancelled || !containerRef.current) return

      const loadedBook = ePub(arrayBuffer)
      const rendition = loadedBook.renderTo(containerRef.current, {
        width: '100%',
        height: '100%',
        spread: 'none',
        flow: 'paginated',
      })

      rendition.themes.register('dark', {
        body: {
          color: '#e5edf6',
          background: '#111827',
          'line-height': '1.72',
          'font-family': 'Georgia, ui-serif, serif',
        },
        '::selection': { background: 'rgba(200,169,106,.35)' },
      })
      rendition.themes.register('light', {
        body: {
          color: '#1f2937',
          background: '#f7f1e7',
          'line-height': '1.72',
          'font-family': 'Georgia, ui-serif, serif',
        },
        '::selection': { background: 'rgba(177,135,55,.32)' },
      })

      rendition.themes.select(preferencesRef.current.theme)
      rendition.themes.fontSize(`${preferencesRef.current.fontSize}px`)
      await rendition.display(bookRef.current.currentLocation)

      rendition.on('selected', (cfiRange: unknown, contents: unknown) => {
        const selection = (contents as { window?: Window }).window?.getSelection()
        const text = selection?.toString().trim() ?? ''
        if (text) {
          setSelectedText(text)
          setLoadingTranslation(true)
          setTranslation(undefined)
          translationService.translate(text, aiSettingsRef.current).then((result) => {
            setTranslation(result)
            setLoadingTranslation(false)
          })
        }
        onBookUpdateRef.current({
          ...bookRef.current,
          currentLocation: String(cfiRange),
          lastOpenedAt: new Date().toISOString(),
        })
      })

      rendition.on('relocated', (location: unknown) => {
        const loc = location as { start?: { cfi?: string; percentage?: number } }
        onBookUpdateRef.current({
          ...bookRef.current,
          currentLocation: loc.start?.cfi,
          progress: Math.round((loc.start?.percentage ?? bookRef.current.progress / 100) * 100),
          lastOpenedAt: new Date().toISOString(),
        })
      })

      epubRef.current = loadedBook
      renditionRef.current = rendition
    }

    boot()

    return () => {
      cancelled = true
      renditionRef.current?.destroy()
      epubRef.current?.destroy()
      renditionRef.current = null
      epubRef.current = null
    }
  }, [book.id])

  useEffect(() => {
    const rendition = renditionRef.current
    if (!rendition) return
    rendition.themes.select(preferences.theme)
    rendition.themes.fontSize(`${preferences.fontSize}px`)
  }, [preferences.fontSize, preferences.theme])

  const updatePreferences = (next: Partial<ReaderPreferences>) =>
    onPreferencesChange({ ...preferences, ...next })

  const searchInBook = () => {
    const text = query.trim()
    if (!text) return
    setSelectedText(text)
    setLoadingTranslation(true)
    setTranslation(undefined)
    translationService.translate(text, aiSettings).then((result) => {
      setTranslation(result)
      setLoadingTranslation(false)
    })
  }

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
          <div className="mx-auto transition-all duration-300" style={readerStyles}>
            <div className={`reader-surface h-[calc(100vh-170px)] min-h-[520px] overflow-hidden rounded-[30px] border border-white/10 ${surfaceClass} shadow-2xl shadow-black/30`}>
              <div ref={containerRef} className="h-full w-full" />
            </div>
          </div>
          <div className="mx-auto mt-3 flex max-w-[760px] items-center justify-between">
            <IconButton label="Page précédente" onClick={() => renditionRef.current?.prev()}>
              <ChevronLeft size={20} />
            </IconButton>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bookmark size={14} className="text-[#c8a96a]" />
              {book.progress}% lu
            </div>
            <IconButton label="Page suivante" onClick={() => renditionRef.current?.next()}>
              <ChevronRight size={20} />
            </IconButton>
          </div>
        </section>

        <aside className="hidden space-y-3 lg:block">
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
            <button type="button" onClick={() => speechService.speak(selectedText || book.title)} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/14">
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
