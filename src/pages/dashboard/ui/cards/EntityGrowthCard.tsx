import { Card } from '../components/Card'
import { Pill } from '../components/Pill'
import { SimpleAreaChart } from '../components/charts/SimpleAreaChart'

export function EntityGrowthCard() {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="text-[28px] font-semibold text-gray-900">
          등록 업장 수
        </div>
        <Pill tone="emerald">전년 대비 +12.4%</Pill>
      </div>

      <SimpleAreaChart />
    </Card>
  )
}
