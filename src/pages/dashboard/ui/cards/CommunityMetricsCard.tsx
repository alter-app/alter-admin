import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { MetricRow } from '../components/MetricRow'
import { Pill } from '../components/Pill'
import { Segmented } from '../components/Segmented'
import { SimpleLineChart } from '../components/charts/SimpleLineChart'

export function CommunityMetricsCard() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="text-[26px] font-semibold text-gray-900">
          가입 회원 수
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="emerald">전년 대비 +12.4%</Pill>
          <Segmented />
        </div>
      </div>

      <SimpleLineChart />
    </Card>
  )
}
