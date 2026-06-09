import { BookmarkPlus, Loader2, Volume2, X } from 'lucide-react'
import type { TranslationResult } from '../../types/translation'

interface Props {
  selectedText: string
  result?: TranslationResult
  loading: boolean
  onClose: () => void
  onSpeak: (text: string) => void
  onSave?: (result: TranslationResult) => void
}

export const TranslationPopover = ({
  selectedText,
  result,
  loading,
  onClose,
  onSpeak,
  onSave,
}: Props) => (
  <aside className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-xl rounded-[28px] border border-white/12 bg-[#0d1523]/88 p-4 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:bottom-6 sm:p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.24em] text-[#c8a96a]">
          Sélection grecque
        </p>
        <h2 className="mt-2 break-words text-lg font-semibold leading-snug text-white">
          {selectedText}
        </h2>
      </div>
      <button
        type="button"
        aria-label="Fermer"
        onClick={onClose}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/8 text-slate-300 transition hover:bg-white/12"
      >
        <X size={18} />
      </button>
    </div>

    {loading ? (
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4 text-sm text-slate-300">
        <Loader2 size={18} className="animate-spin text-[#c8a96a]" />
        Analyse contextuelle...
      </div>
    ) : result ? (
      <div className="mt-5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Français</p>
          <p className="mt-1 break-words text-xl font-semibold text-slate-50">
            {result.translation}
          </p>
          {result.transliteration ? (
            <p className="mt-1 text-sm text-slate-400">{result.transliteration}</p>
          ) : null}
        </div>
        <p className="break-words rounded-2xl bg-white/[0.055] p-4 text-sm leading-6 text-slate-300">
          {result.explanation}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSpeak(result.sourceText)}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/14"
          >
            <Volume2 size={16} /> Audio
          </button>
          <button
            type="button"
            onClick={() => onSave?.(result)}
            className="inline-flex items-center gap-2 rounded-full bg-[#c8a96a] px-4 py-2 text-sm font-medium text-[#14100a] transition hover:bg-[#d8bd80]"
          >
            <BookmarkPlus size={16} /> Vocabulaire
          </button>
        </div>
      </div>
    ) : null}
  </aside>
)
