import { Card } from '../components/Card'
import { Icon } from '../components/Icon'

export function MonthlyAvgCard() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon name="bell" className="h-5 w-5" />
        </div>
        <div className="text-[10px] font-semibold tracking-wide text-gray-400">월 평균</div>
      </div>

      <div className="mt-5 text-[56px] font-semibold leading-none text-gray-900">19</div>
      <div className="mt-2 text-[11px] font-semibold tracking-wide text-gray-400">이번 달 리포트</div>

      <div className="mt-5 flex items-center justify-between text-[11px] font-semibold text-gray-500">
        <span>목표: &lt; 25</span>
        <span className="text-emerald-700">정상 진행</span>
      </div>
    </Card>
  )
}

