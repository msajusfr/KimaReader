import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  children: ReactNode
  active?: boolean
}

export const IconButton = ({ label, children, active, className = '', ...props }: IconButtonProps) => (
  <button
    type="button"
    aria-label={label}
    title={label}
    className={`grid h-10 w-10 place-items-center rounded-full border text-sm transition ${
      active
        ? 'border-[#c8a96a]/60 bg-[#c8a96a]/16 text-[#f8e7bf]'
        : 'border-white/10 bg-white/[0.06] text-slate-200 hover:border-white/20 hover:bg-white/[0.1]'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
)
