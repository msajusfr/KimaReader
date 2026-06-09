import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { VocabularyItem } from '../../types/vocabulary'

export const VocabularyPanel = ({ items }: { items: VocabularyItem[] }) => {
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        `${item.greek} ${item.translation}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  )

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[#c8a96a]">Vocabulaire</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{items.length} entrées</h2>
        </div>
      </div>
      <label className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/18 px-3 py-2">
        <Search size={16} className="text-slate-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        />
      </label>
      <div className="mt-4 max-h-[360px] space-y-2 overflow-auto pr-1">
        {filtered.map((item) => (
          <article key={item.id} className="rounded-2xl bg-white/[0.06] p-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="break-words font-semibold text-white">{item.greek}</h3>
              <span className="shrink-0 rounded-full bg-white/8 px-2 py-1 text-[11px] text-slate-300">
                {item.difficulty}
              </span>
            </div>
            <p className="mt-1 break-words text-sm text-[#f0ddb2]">{item.translation}</p>
            {item.context ? (
              <p className="mt-2 line-clamp-2 break-words text-xs leading-5 text-slate-400">
                {item.context}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
