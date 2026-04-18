import { Card } from '../components/Card'

export function LiveFeedCard({
  reportCount,
  loading,
}: {
  reportCount: number
  loading: boolean
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
          <span className="text-[12px] font-black">!</span>
        </div>
        <div className="text-[10px] font-semibold tracking-wide text-gray-400">
          실시간 피드
        </div>
      </div>

      <div className="mt-5 text-[56px] font-semibold leading-none text-gray-900">
        {loading ? '-' : reportCount.toLocaleString('ko-KR')}
      </div>
      <div className="mt-2 text-[11px] font-semibold tracking-wide text-gray-400">
        오늘 리포트
      </div>

      <div className="mt-5 flex items-center gap-2 text-[12px] font-semibold text-rose-600">
        <span className="h-2 w-2 rounded-full bg-rose-600" aria-hidden="true" />
        긴급 조치 필요
      </div>
    </Card>
  )
}
