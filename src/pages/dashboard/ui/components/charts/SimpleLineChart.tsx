export function SimpleLineChart() {
  return (
    <div className="mt-5">
      <div className="relative h-[260px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50 to-white">
        <svg viewBox="0 0 600 280" className="absolute inset-0 h-full w-full">
          <path
            d="M0,230 C80,210 120,235 170,215 C220,195 260,210 320,180 C380,150 420,165 470,120 C520,70 560,135 600,110"
            fill="none"
            stroke="rgba(4,120,87,0.95)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="520" cy="82" r="10" fill="rgba(16,185,129,0.25)" />
          <circle cx="520" cy="82" r="5" fill="rgba(4,120,87,0.95)" />
        </svg>
      </div>
    </div>
  )
}

