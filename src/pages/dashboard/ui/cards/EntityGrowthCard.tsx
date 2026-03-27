import { Card } from '../components/Card'
import { Pill } from '../components/Pill'
import { SimpleAreaChart } from '../components/charts/SimpleAreaChart'

export function EntityGrowthCard() {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] text-gray-400">엔티티 성장</div>
          <div className="mt-2 text-[28px] font-semibold text-gray-900">등록된 사업체</div>
        </div>
        <Pill tone="emerald">전년 대비 +12.4%</Pill>
      </div>

      <SimpleAreaChart />
    </Card>
  )
}

