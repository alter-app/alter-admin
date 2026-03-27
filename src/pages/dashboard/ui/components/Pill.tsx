import type { ReactNode } from 'react'

export function Pill({ children, tone }: { children: ReactNode; tone: 'emerald' | 'gray' }) {
  const cls =
    tone === 'emerald'
      ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
      : 'bg-gray-100 text-gray-500'

  return (
    <span
      className={['inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold', cls].join(
        ' ',
      )}
    >
      {children}
    </span>
  )
}

