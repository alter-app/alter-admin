export function SimpleAreaChart() {
  return (
    <div className="mt-5">
      <div className="relative h-[220px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50 to-white">
        <svg viewBox="0 0 600 240" className="absolute inset-0 h-full w-full">
          <path
            d="M0,170 C70,150 110,165 160,150 C210,135 240,140 290,125 C340,110 380,135 420,95 C470,45 520,95 600,70 L600,240 L0,240 Z"
            fill="rgba(16,185,129,0.12)"
          />
          <path
            d="M0,170 C70,150 110,165 160,150 C210,135 240,140 290,125 C340,110 380,135 420,95 C470,45 520,95 600,70"
            fill="none"
            stroke="rgba(4,120,87,0.95)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute bottom-4 left-6 right-6 flex justify-between text-[10px] font-semibold tracking-wide text-gray-400">
          <span>1월</span>
          <span>3월</span>
          <span>5월</span>
          <span>7월</span>
          <span>9월</span>
          <span>11월</span>
        </div>
      </div>
    </div>
  )
}

