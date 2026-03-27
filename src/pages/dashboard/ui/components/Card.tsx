import type { ReactNode } from 'react'

export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">{children}</div>
}

