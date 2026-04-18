import { Card } from '../components/Card'
import { Icon } from '../components/Icon'

export function WeeklyActiveUsersCard({
  activeUserCount,
  loading,
}: {
  activeUserCount: number
  loading: boolean
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon name="bell" className="h-5 w-5" />
        </div>
        <div className="text-[10px] font-semibold tracking-wide text-gray-400">
          주간 요약
        </div>
      </div>

      <div className="mt-5 text-[56px] font-semibold leading-none text-gray-900">
        {loading ? '-' : activeUserCount.toLocaleString('ko-KR')}
      </div>
      <div className="mt-2 text-[11px] font-semibold tracking-wide text-gray-400">
        이번 주 활성 사용자
      </div>

      <div className="mt-5 flex items-center justify-between text-[11px] font-semibold text-gray-500">
        <span>목표: 1,500명</span>
        <span className="text-emerald-700">성장 중</span>
      </div>
    </Card>
  )
}
