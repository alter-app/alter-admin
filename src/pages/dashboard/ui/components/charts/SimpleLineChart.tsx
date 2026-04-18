type ChartPoint = {
  label: string
  count: number
}

function buildLinePath(points: ChartPoint[]) {
  if (points.length === 0) return ''

  const width = 600
  const height = 280
  const max = Math.max(...points.map((point) => point.count), 1)
  const min = Math.min(...points.map((point) => point.count), 0)
  const range = Math.max(max - min, 1)

  const coordinates = points.map((point, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * width
    const normalized = (point.count - min) / range
    const y = height - normalized * 170 - 40
    return { x, y }
  })

  return coordinates.map((coord, index) => `${index === 0 ? 'M' : 'L'}${coord.x},${coord.y}`).join(' ')
}

export function SimpleLineChart({
  dataPoints,
  loading: _loading,
}: {
  dataPoints: ChartPoint[]
  loading: boolean
}) {
  const linePath = buildLinePath(dataPoints)

  return (
    <div className="mt-5">
      <div className="relative h-[260px] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-50 to-white">
        <svg viewBox="0 0 600 280" className="absolute inset-0 h-full w-full">
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
      </div>
    </div>
  )
}

