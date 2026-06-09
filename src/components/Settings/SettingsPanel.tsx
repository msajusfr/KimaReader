import { KeyRound, X } from 'lucide-react'
import type { AiSettings } from '../../types/settings'

interface Props {
  open: boolean
  settings: AiSettings
  onChange: (settings: AiSettings) => void
  onClose: () => void
}

export const SettingsPanel = ({ open, settings, onChange, onClose }: Props) => {
  if (!open) return null

  const update = (next: Partial<AiSettings>) => onChange({ ...settings, ...next })

  return (
    <div className="fixed inset-0 z-50 bg-black/45 px-4 py-5 backdrop-blur-sm">
      <section className="mx-auto max-w-lg rounded-[30px] border border-white/12 bg-[#0d1523]/94 p-5 text-slate-100 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[#c8a96a]">
              <KeyRound size={18} />
              <p className="text-xs font-medium uppercase tracking-[0.24em]">
                Configuration API
              </p>
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-white">Traduction</h2>
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

        <div className="mt-5 grid grid-cols-2 rounded-full border border-white/10 bg-black/18 p-1">
          <button
            type="button"
            onClick={() => update({ provider: 'mock' })}
            className={`rounded-full px-4 py-2 text-sm transition ${
              settings.provider === 'mock'
                ? 'bg-white/14 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Simulation
          </button>
          <button
            type="button"
            onClick={() => update({ provider: 'openai' })}
            className={`rounded-full px-4 py-2 text-sm transition ${
              settings.provider === 'openai'
                ? 'bg-[#c8a96a] text-[#15120b]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            OpenAI
          </button>
        </div>

        <label className="mt-5 block text-sm text-slate-300">
          Clé API OpenAI
          <input
            type="password"
            value={settings.openAiApiKey}
            onChange={(event) => update({ openAiApiKey: event.target.value })}
            placeholder="sk-..."
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#c8a96a]/60"
          />
        </label>

        <label className="mt-4 block text-sm text-slate-300">
          Modèle
          <input
            value={settings.openAiModel}
            onChange={(event) => update({ openAiModel: event.target.value })}
            placeholder="gpt-5.4-mini"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/24 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#c8a96a]/60"
          />
        </label>

        <p className="mt-4 rounded-2xl bg-white/[0.055] p-4 text-xs leading-5 text-slate-400">
          Sans backend, la clé reste dans le navigateur via localStorage. C’est acceptable
          pour tester localement, mais une app publiée devrait passer par un proxy serveur
          pour protéger la clé.
        </p>
      </section>
    </div>
  )
}
