type ChartPoint = {
  label: string
  count: number
}

function buildLinePath(points: ChartPoint[]) {
  if (points.length === 0) return ''

  const width = 600
  const height = 240
  const max = Math.max(...points.map((point) => point.count), 1)
  const min = Math.min(...points.map((point) => point.count), 0)
  const range = Math.max(max - min, 1)

  const coordinates = points.map((point, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * width
    const normalized = (point.count - min) / range
    const y = height - normalized * 170 - 30
    return { x, y }
  })

  return coordinates.map((coord, index) => `${index === 0 ? 'M' : 'L'}${coord.x},${coord.y}`).join(' ')
}

export function SimpleAreaChart({
  dataPoints,
  loading,
}: {
  dataPoints: ChartPoint[]
  loading: boolean
}) {
  const linePath = buildLinePath(dataPoints)
  const areaPath =
    linePath.length > 0 ? `${linePath} L600,240 L0,240 Z` : 'M0,200 L600,200 L600,240 L0,240 Z'

  return (
    <div className="mt-5">
      <div className="relative h-[220px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50 to-white">
        <svg viewBox="0 0 600 240" className="absolute inset-0 h-full w-full">
          <path d={areaPath} fill="rgba(16,185,129,0.12)" />
          {linePath.length > 0 ? (
            <path
              d={linePath}
              fill="none"
              stroke="rgba(4,120,87,0.95)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ) : null}
        </svg>

        <div className="absolute bottom-4 left-6 right-6 flex justify-between text-[10px] font-semibold tracking-wide text-gray-400">
          {(loading || dataPoints.length === 0
            ? ['-', '-', '-', '-', '-', '-']
            : dataPoints.slice(0, 6).map((point) => point.label)
          ).map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

