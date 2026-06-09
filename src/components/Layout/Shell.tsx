import type { ReactNode } from 'react'

export const Shell = ({ children }: { children: ReactNode }) => (
  <main className="min-h-screen bg-[#09111d] text-slate-100">
    <div className="fixed inset-0 -z-0 bg-[radial-gradient(circle_at_18%_8%,rgba(84,117,146,0.22),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(184,149,82,0.12),transparent_30%),linear-gradient(145deg,#080d16_0%,#0f172a_48%,#111827_100%)]" />
    <div className="fixed inset-0 -z-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.9)_1px,transparent_1px)] [background-size:44px_44px]" />
    <div className="relative z-10">{children}</div>
  </main>
)
