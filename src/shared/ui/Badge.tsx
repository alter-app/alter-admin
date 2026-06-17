import type { CSSProperties } from 'react'

interface BadgeProps {
  text: string
  bg: string
  fg: string
  style?: CSSProperties
}

export function Badge({ text, bg, fg, style }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 11px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        background: bg,
        color: fg,
        ...style,
      }}
    >
      {text}
    </span>
  )
}
