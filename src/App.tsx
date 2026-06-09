import { useCallback, useEffect, useMemo, useState } from 'react'
import { Shell } from './components/Layout/Shell'
import { ReaderView } from './components/Reader/ReaderView'
import { SettingsPanel } from './components/Settings/SettingsPanel'
import { useTheme } from './hooks/useTheme'
import { useVocabulary } from './hooks/useVocabulary'
import { LibraryPage } from './pages/LibraryPage'
import { bookService } from './services/bookService'
import { storageService } from './services/storageService'
import type { BookProgress } from './types/book'

const createEmptyProgress = (bookId: string): BookProgress => ({
  bookId,
  chapterIndex: 0,
  progress: 0,
})

function App() {
  const books = useMemo(() => bookService.getBooks(), [])
  const [progresses, setProgresses] = useState<BookProgress[]>(() =>
    storageService.getBookProgresses(),
  )
  const [activeBookId, setActiveBookId] = useState<string | undefined>(() => {
    const lastBookId = storageService.getSession().lastBookId
    return bookService.getBookById(lastBookId)?.id
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [aiSettings, setAiSettings] = useState(() => storageService.getAiSettings())
  const { preferences, setPreferences } = useTheme()
  const vocabulary = useVocabulary()

  const activeBook = bookService.getBookById(activeBookId)

  const getProgress = useCallback(
    (bookId: string) =>
      progresses.find((progress) => progress.bookId === bookId) ??
      createEmptyProgress(bookId),
    [progresses],
  )

  useEffect(() => {
    storageService.saveBookProgresses(progresses)
  }, [progresses])

  useEffect(() => {
    storageService.saveAiSettings(aiSettings)
  }, [aiSettings])

  useEffect(() => {
    const history = activeBook
      ? [
          { bookId: activeBook.id, title: activeBook.title, openedAt: new Date().toISOString() },
          ...storageService.getSession().history.filter((item) => item.bookId !== activeBook.id),
        ].slice(0, 12)
      : storageService.getSession().history
    storageService.saveSession({ lastBookId: activeBookId, history })
  }, [activeBook, activeBookId])

  const updateProgress = useCallback((updated: BookProgress) => {
    setProgresses((current) => [
      updated,
      ...current.filter((progress) => progress.bookId !== updated.bookId),
    ])
  }, [])

  return (
    <Shell>
      {activeBook ? (
        <ReaderView
          book={activeBook}
          progress={getProgress(activeBook.id)}
          preferences={preferences}
          onPreferencesChange={setPreferences}
          onBack={() => setActiveBookId(undefined)}
          onProgressChange={updateProgress}
          onSaveVocabulary={vocabulary.addFromTranslation}
          aiSettings={aiSettings}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : (
        <LibraryPage
          books={books}
          getProgress={getProgress}
          vocabulary={vocabulary.items}
          onOpenBook={(book) => setActiveBookId(book.id)}
          onOpenSettings={() => setSettingsOpen(true)}
          apiConfigured={aiSettings.provider === 'openai' && Boolean(aiSettings.openAiApiKey.trim())}
        />
      )}
      <SettingsPanel
        open={settingsOpen}
        settings={aiSettings}
        onChange={setAiSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </Shell>
  )
}

export default App
