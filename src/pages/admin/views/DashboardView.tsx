import { buildChart } from '@/shared/admin/data'
import type { Metric, Period } from '@/shared/admin/data'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import { useDashboardChart, useWeeklySummary } from '@/features/dashboard/hooks/useDashboard'

const RIX = "'RixYeoljeongdo_Pro'"

interface Seg {
  label: string
  on: () => void
  bg: string
  fg: string
  shadow: string
}

const seg = (active: boolean, label: string, on: () => void): Seg => ({
  label,
  on,
  bg: active ? '#fff' : 'transparent',
  fg: active ? '#232323' : '#828282',
  shadow: active ? '0 1px 3px rgba(0,0,0,.12)' : 'none',
})

function SegGroup({ items }: { items: Seg[] }) {
  return (
    <div
      style={{
        display: 'flex',
        background: '#f4f4f4',
        borderRadius: 10,
        padding: 3,
      }}
    >
      {items.map(t => (
        <button
          key={t.label}
          type="button"
          onClick={t.on}
          style={{
            height: 32,
            padding: '0 14px',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            background: t.bg,
            color: t.fg,
            boxShadow: t.shadow,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

const PERIOD_MAP: Record<string, string> = {
  weekly: 'WEEKLY',
  monthly: 'MONTHLY',
  yearly: 'YEARLY',
}

export function DashboardView() {
  const chartMetric = useAdminStore(s => s.chartMetric)
  const period = useAdminStore(s => s.period)
  const setMetric = useAdminStore(s => s.setMetric)
  const setPeriod = useAdminStore(s => s.setPeriod)
  const selectMenu = useAdminStore(s => s.selectMenu)

  const currentYear = new Date().getFullYear()
  const { data: chartData } = useDashboardChart(PERIOD_MAP[period], currentYear)
  const { data: weekly } = useWeeklySummary()

  // Build chart geometry from API data or fall back to mock
  const apiSeries = chartData
    ? (chartMetric === 'members' ? chartData.memberChart : chartData.workspaceChart)
    : null
  const chart = buildChart(chartMetric, period, apiSeries ?? undefined)

  const totalMembers = apiSeries && chartMetric === 'members'
    ? (chartData?.memberChart.dataPoints.slice(-1)[0]?.value ?? 0)
    : null
  const totalWorkspaces = apiSeries && chartMetric === 'workspaces'
    ? (chartData?.workspaceChart.dataPoints.slice(-1)[0]?.value ?? 0)
    : null

  const yoy = apiSeries
    ? `${apiSeries.yearOverYearGrowthRate > 0 ? '+' : ''}${(apiSeries.yearOverYearGrowthRate * 100).toFixed(1)}%`
    : chart.yoy

  const kpis = [
    {
      label: '총 회원 수',
      value: totalMembers !== null ? totalMembers.toLocaleString() : '—',
      unit: '명',
      dot: '#07c079',
      delta: chartData ? `▲ ${(chartData.memberChart.yearOverYearGrowthRate * 100).toFixed(1)}%` : '—',
      deltaNote: '전년 대비',
      deltaColor: '#07c079',
      on: () => selectMenu('members'),
    },
    {
      label: '등록 업장 수',
      value: totalWorkspaces !== null ? totalWorkspaces.toLocaleString() : '—',
      unit: '개',
      dot: '#003BDC',
      delta: chartData ? `▲ ${(chartData.workspaceChart.yearOverYearGrowthRate * 100).toFixed(1)}%` : '—',
      deltaNote: '전년 대비',
      deltaColor: '#07c079',
      on: () => selectMenu('workspaces'),
    },
    {
      label: '주간 신고 접수',
      value: weekly ? weekly.weeklyReportCount.toLocaleString() : '—',
      unit: '건',
      dot: '#e8920b',
      delta: '',
      deltaNote: '이번 주',
      deltaColor: '#e8920b',
      on: () => selectMenu('reports'),
    },
    {
      label: '신규 매니저',
      value: weekly ? weekly.weeklyNewWorkerCount.toLocaleString() : '—',
      unit: '명',
      dot: '#dc0000',
      delta: '',
      deltaNote: '이번 주',
      deltaColor: '#828282',
      on: () => selectMenu('members'),
    },
  ]

  const metricItems: Seg[] = [
    seg(chartMetric === 'members', '회원', () => setMetric('members' as Metric)),
    seg(chartMetric === 'workspaces', '업장', () => setMetric('workspaces' as Metric)),
  ]
  const periodItems: Seg[] = [
    seg(period === 'weekly', '주간', () => setPeriod('weekly' as Period)),
    seg(period === 'monthly', '월간', () => setPeriod('monthly' as Period)),
    seg(period === 'yearly', '연간', () => setPeriod('yearly' as Period)),
  ]

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 22,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>대시보드</h1>
        <span style={{ fontSize: 13, color: '#a3a3a3' }}>기준 연도 {currentYear}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 16,
          marginBottom: 16,
        }}
      >
        {kpis.map(k => (
          <button
            key={k.label}
            type="button"
            onClick={k.on}
            className="adm-kpi"
            style={{
              textAlign: 'left',
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: 16,
              padding: 20,
              cursor: 'pointer',
              transition: 'all .18s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#828282',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: k.dot,
                }}
              />
              {k.label}
            </div>
            <div
              style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'baseline',
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: RIX,
                  fontSize: 32,
                  color: '#232323',
                  lineHeight: 1,
                }}
              >
                {k.value}
              </span>
              <span style={{ fontSize: 14, color: '#828282' }}>{k.unit}</span>
            </div>
            {k.delta && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: k.deltaColor,
                }}
              >
                {k.delta}{' '}
                <span style={{ color: '#a3a3a3', fontWeight: 400 }}>
                  {k.deltaNote}
                </span>
              </div>
            )}
            {!k.delta && (
              <div style={{ marginTop: 10, fontSize: 13, color: '#a3a3a3' }}>
                {k.deltaNote}
              </div>
            )}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.65fr 1fr',
          gap: 16,
        }}
      >
        <section
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 16,
            padding: 22,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 6,
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                성장 추이
              </h2>
              <p style={{ margin: '5px 0 0', fontSize: 13, color: '#828282' }}>
                전년 대비{' '}
                <span style={{ color: '#07c079', fontWeight: 600 }}>
                  {yoy}
                </span>{' '}
                증가
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SegGroup items={metricItems} />
              <SegGroup items={periodItems} />
            </div>
          </div>

          <svg
            viewBox="0 0 760 250"
            style={{
              width: '100%',
              height: 'auto',
              marginTop: 8,
              overflow: 'visible',
            }}
          >
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#07c079" stopOpacity="0.22" />
                <stop offset="1" stopColor="#07c079" stopOpacity="0" />
              </linearGradient>
            </defs>
            {chart.grid.map((g, i) => (
              <g key={i}>
                <line
                  x1="0"
                  x2="760"
                  y1={g.y}
                  y2={g.y}
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
                <text x="0" y={g.ty} fill="#c3c3c3" fontSize="11">
                  {g.label}
                </text>
              </g>
            ))}
            <path d={chart.areaPath} fill="url(#areaGrad)" />
            <path
              d={chart.linePath}
              fill="none"
              stroke="#07c079"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {chart.dots.map((d, i) => (
              <g key={i}>
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={d.r}
                  fill="#fff"
                  stroke="#07c079"
                  strokeWidth="2.5"
                />
                <text
                  x={d.x}
                  y="245"
                  fill="#a3a3a3"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              </g>
            ))}
          </svg>
        </section>

        <section
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
            }}
          >
            <button
              type="button"
              onClick={() => selectMenu('reports')}
              className="adm-card-amber"
              style={{
                textAlign: 'left',
                background: 'linear-gradient(135deg,#fff,#fdf3e2)',
                border: '1px solid #f3e2c4',
                borderRadius: 16,
                padding: 18,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#b9740a' }}>
                주간 신고 접수
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: RIX,
                  fontSize: 32,
                  color: '#232323',
                }}
              >
                {weekly?.weeklyReportCount ?? '—'}
                <span
                  style={{
                    fontSize: 14,
                    color: '#828282',
                    fontFamily: 'Pretendard',
                  }}
                >
                  {' '}
                  건
                </span>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: '#e8920b' }}>
                신고 관리 →
              </div>
            </button>
            <button
              type="button"
              onClick={() => selectMenu('members')}
              className="adm-card-white"
              style={{
                textAlign: 'left',
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: 16,
                padding: 18,
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: '#828282' }}>
                신규 매니저
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontFamily: RIX,
                  fontSize: 32,
                  color: '#232323',
                }}
              >
                {weekly?.weeklyNewWorkerCount ?? '—'}
                <span
                  style={{
                    fontSize: 14,
                    color: '#828282',
                    fontFamily: 'Pretendard',
                  }}
                >
                  {' '}
                  명
                </span>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: '#828282' }}>
                이번 주
              </div>
            </button>
          </div>
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: 16,
              padding: 20,
            }}
          >
            <h3
              style={{
                margin: '0 0 14px',
                fontSize: 14,
                fontWeight: 600,
                color: '#828282',
              }}
            >
              주간 요약
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <SummaryRow
                label="신규 매니저"
                value={weekly ? `+ ${weekly.weeklyNewWorkerCount}` : '—'}
                unit="명"
              />
              <div style={{ height: 1, background: '#f4f4f4' }} />
              <SummaryRow
                label="주간 신고 접수"
                value={weekly ? String(weekly.weeklyReportCount) : '—'}
                unit="건"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

function SummaryRow({
  label,
  value,
  unit,
  valueColor,
}: {
  label: string
  value: string
  unit: string
  valueColor?: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <span style={{ fontSize: 14, color: '#5f5f5f' }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 600, color: valueColor }}>
        {value}
        <span style={{ fontSize: 13, color: '#828282', fontWeight: 400 }}>
          {' '}
          {unit}
        </span>
      </span>
    </div>
  )
}
