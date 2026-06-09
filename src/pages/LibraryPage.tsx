import { BookOpen, FileUp, KeyRound, Library, Play, Sparkles } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { VocabularyPanel } from '../components/Vocabulary/VocabularyPanel'
import type { BookRecord } from '../types/book'
import type { VocabularyItem } from '../types/vocabulary'

interface Props {
  books: BookRecord[]
  vocabulary: VocabularyItem[]
  onImport: (file: File) => void
  onOpenBook: (book: BookRecord) => void
  importing: boolean
  onOpenSettings: () => void
  apiConfigured: boolean
}

export const LibraryPage = ({
  books,
  vocabulary,
  onImport,
  onOpenBook,
  importing,
  onOpenSettings,
  apiConfigured,
}: Props) => {
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onImport(file)
    event.target.value = ''
  }

  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[1fr_340px] lg:px-6">
      <section className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-4 py-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#c8a96a]">
              <Library size={18} />
              <span className="text-xs font-medium uppercase tracking-[0.28em]">KimaReader</span>
            </div>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-normal text-white sm:text-5xl">
              Lire le grec moderne avec calme, contexte et mémoire.
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onOpenSettings}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg transition ${
                apiConfigured
                  ? 'bg-white/10 text-white hover:bg-white/14'
                  : 'bg-[#24364a] text-white hover:bg-[#2d435c]'
              }`}
            >
              <KeyRound size={18} />
              API
            </button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#d6bd7a] px-5 py-3 text-sm font-semibold text-[#15120b] shadow-lg shadow-[#d6bd7a]/10 transition hover:bg-[#e2cc91]">
              <FileUp size={18} />
              {importing ? 'Import...' : 'Importer EPUB'}
              <input type="file" accept=".epub,application/epub+zip" className="sr-only" onChange={handleFile} />
            </label>
          </div>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
            <p className="text-2xl font-semibold text-white">{books.length}</p>
            <p className="mt-1 text-sm text-slate-400">livres locaux</p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
            <p className="text-2xl font-semibold text-white">{vocabulary.length}</p>
            <p className="mt-1 text-sm text-slate-400">mots mémorisés</p>
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
            <p className="text-2xl font-semibold text-white">PWA</p>
            <p className="mt-1 text-sm text-slate-400">installable mobile</p>
          </div>
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Bibliothèque</h2>
            <p className="text-sm text-slate-400">EPUB local, sans backend</p>
          </div>
          {books.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <article key={book.id} className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[0.085]">
                  <div className="flex gap-4">
                    <div className="grid h-28 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600/45 to-[#c8a96a]/24 shadow-inner">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <BookOpen size={28} className="text-[#f4d992]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 break-words text-lg font-semibold text-white">{book.title}</h3>
                      <p className="mt-1 truncate text-sm text-slate-400">{book.author}</p>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-[#c8a96a]" style={{ width: `${book.progress}%` }} />
                      </div>
                      <button type="button" onClick={() => onOpenBook(book)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition group-hover:bg-[#c8a96a] group-hover:text-[#15120b]">
                        <Play size={15} /> Lire
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] border border-dashed border-white/16 bg-white/[0.045] p-8 text-center backdrop-blur-xl">
              <Sparkles className="mx-auto text-[#c8a96a]" size={32} />
              <h3 className="mt-4 text-xl font-semibold text-white">Importez votre premier EPUB grec</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Le fichier reste dans le navigateur. KimaReader restaure ensuite la lecture, les préférences et le vocabulaire.
              </p>
            </div>
          )}
        </section>
      </section>

      <aside className="space-y-4">
        <VocabularyPanel items={vocabulary} />
      </aside>
    </div>
  )
}
