import { Card } from '../components/Card'
import { Pill } from '../components/Pill'
import { Segmented } from '../components/Segmented'
import { SimpleAreaChart } from '../components/charts/SimpleAreaChart'

export function EntityGrowthCard() {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="text-[28px] font-semibold text-gray-900">
          등록 업장 수
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="emerald">전년 대비 +12.4%</Pill>
          <Segmented />
        </div>
      </div>

      <SimpleAreaChart />
    </Card>
  )
}
