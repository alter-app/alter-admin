import { Card } from '../components/Card'
import { Pill } from '../components/Pill'
import { Segmented } from '../components/Segmented'
import { SimpleAreaChart } from '../components/charts/SimpleAreaChart'

type ChartPoint = {
  label: string
  count: number
}

export function EntityGrowthCard({
  growthRate,
  dataPoints,
  loading,
}: {
  growthRate: number
  dataPoints: ChartPoint[]
  loading: boolean
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="text-[28px] font-semibold text-gray-900">
          등록 업장 수
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="emerald">
            {loading ? '로딩 중' : `전년 대비 ${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%`}
          </Pill>
          <Segmented />
        </div>
      </div>

      <SimpleAreaChart dataPoints={dataPoints} loading={loading} />
    </Card>
  )
}
