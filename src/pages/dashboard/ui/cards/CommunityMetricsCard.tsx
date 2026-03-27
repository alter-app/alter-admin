import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { MetricRow } from '../components/MetricRow'
import { Segmented } from '../components/Segmented'
import { SimpleLineChart } from '../components/charts/SimpleLineChart'

export function CommunityMetricsCard() {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-semibold tracking-[0.22em] text-gray-400">커뮤니티 지표</div>
          <div className="mt-2 text-[26px] font-semibold text-gray-900">가입 멤버 수</div>
        </div>

        <Segmented />
      </div>

      <SimpleLineChart />

      <div className="mt-6 flex items-end justify-between gap-6">
        <div className="flex items-end gap-10">
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-gray-400">현재</div>
            <div className="mt-1 text-[20px] font-semibold text-gray-900">12,482</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-wide text-gray-400">평균 증가</div>
            <div className="mt-1 text-[20px] font-semibold text-gray-900">842/mo</div>
          </div>
        </div>

        <a
          href="#"
          className="flex items-center gap-2 text-[12px] font-semibold text-emerald-800 hover:text-emerald-900"
        >
          상세 분석 보기
          <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricRow label="스토어 관리" value="98% 활성 상태" />
        <MetricRow label="콘텐츠 파이프라인" value="검토 대기 12건" />
        <MetricRow label="시스템 상태" value="성능 최적화" />
      </div>

      <div className="pointer-events-none relative">
        <button
          type="button"
          className="pointer-events-auto absolute right-6 top-1/2 -translate-y-1/2 rounded-2xl bg-emerald-700 p-4 text-white shadow-lg hover:bg-emerald-800"
          aria-label="추가"
        >
          <Icon name="plus" className="h-5 w-5" />
        </button>
      </div>
    </Card>
  )
}

