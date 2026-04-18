import { Card } from '../components/Card'
import { Pill } from '../components/Pill'
import { Segmented } from '../components/Segmented'
import { SimpleLineChart } from '../components/charts/SimpleLineChart'

type ChartPoint = {
  label: string
  count: number
}

export function CommunityMetricsCard({
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
      <div className="flex items-start justify-between gap-4">
        <div className="text-[26px] font-semibold text-gray-900">
          가입 회원 수
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="emerald">
            {loading ? '로딩 중' : `전년 대비 ${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%`}
          </Pill>
          <Segmented />
        </div>
      </div>

      <SimpleLineChart dataPoints={dataPoints} loading={loading} />
    </Card>
  )
}
