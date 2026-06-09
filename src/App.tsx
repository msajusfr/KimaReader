import { useCallback, useEffect, useState } from 'react'
import { Shell } from './components/Layout/Shell'
import { ReaderView } from './components/Reader/ReaderView'
import { defaultBooks } from './data/sampleData'
import { useTheme } from './hooks/useTheme'
import { useVocabulary } from './hooks/useVocabulary'
import { epubService } from './services/epubService'
import { storageService } from './services/storageService'
import type { BookRecord } from './types/book'
import { LibraryPage } from './pages/LibraryPage'

function App() {
  const [books, setBooks] = useState<BookRecord[]>(() => {
    const storedBooks = storageService.getBooks()
    const missingDefaultBooks = defaultBooks.filter(
      (defaultBook) => !storedBooks.some((book) => book.id === defaultBook.id),
    )
    return [...missingDefaultBooks, ...storedBooks]
  })
  const [activeBookId, setActiveBookId] = useState<string | undefined>(() => storageService.getSession().lastBookId)
  const [importing, setImporting] = useState(false)
  const { preferences, setPreferences } = useTheme()
  const vocabulary = useVocabulary()

  const activeBook = books.find((book) => book.id === activeBookId)

  useEffect(() => {
    storageService.saveBooks(books)
  }, [books])

  useEffect(() => {
    const history = activeBook
      ? [
          { bookId: activeBook.id, title: activeBook.title, openedAt: new Date().toISOString() },
          ...storageService.getSession().history.filter((item) => item.bookId !== activeBook.id),
        ].slice(0, 12)
      : storageService.getSession().history
    storageService.saveSession({ lastBookId: activeBookId, history })
  }, [activeBook, activeBookId])

  const importBook = async (file: File) => {
    setImporting(true)
    try {
      const book = await epubService.importBook(file)
      setBooks((current) => [book, ...current])
      setActiveBookId(book.id)
    } finally {
      setImporting(false)
    }
  }

  const updateBook = useCallback((updated: BookRecord) => {
    setBooks((current) => current.map((book) => (book.id === updated.id ? updated : book)))
  }, [])

  return (
    <Shell>
      {activeBook ? (
        <ReaderView
          book={activeBook}
          preferences={preferences}
          onPreferencesChange={setPreferences}
          onBack={() => setActiveBookId(undefined)}
          onBookUpdate={updateBook}
          onSaveVocabulary={vocabulary.addFromTranslation}
        />
      ) : (
        <LibraryPage
          books={books}
          vocabulary={vocabulary.items}
          importing={importing}
          onImport={importBook}
          onOpenBook={(book) => setActiveBookId(book.id)}
        />
      )}
    </Shell>
  )
}

export default App
