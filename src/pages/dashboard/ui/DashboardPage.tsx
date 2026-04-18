import { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { CommunityMetricsCard } from './cards/CommunityMetricsCard'
import { EntityGrowthCard } from './cards/EntityGrowthCard'
import { LiveFeedCard } from './cards/LiveFeedCard'
import { WeeklyActiveUsersCard } from './cards/WeeklyActiveUsersCard'

type WeeklySummaryResponse = {
  timestamp: string
  data: {
    weeklyReportCount: number
    weeklyNewWorkerCount: number
  }
}

type ChartDataPoint = {
  label: string
  count: number
}

type DashboardChartResponse = {
  timestamp: string
  data: {
    workspaceChart: {
      period: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
      year: number
      yearOverYearGrowthRate: number
      dataPoints: ChartDataPoint[]
    }
    memberChart: {
      period: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
      year: number
      yearOverYearGrowthRate: number
      dataPoints: ChartDataPoint[]
    }
  }
}

export function DashboardPage() {
  const [weeklyReportCount, setWeeklyReportCount] = useState(0)
  const [weeklyActiveUserCount, setWeeklyActiveUserCount] = useState(0)
  const [workspaceGrowthRate, setWorkspaceGrowthRate] = useState(0)
  const [memberGrowthRate, setMemberGrowthRate] = useState(0)
  const [workspaceDataPoints, setWorkspaceDataPoints] = useState<ChartDataPoint[]>([])
  const [memberDataPoints, setMemberDataPoints] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboardData() {
      try {
        const currentYear = new Date().getFullYear()
        const chartQuery = new URLSearchParams({
          period: 'MONTHLY',
          year: String(currentYear),
        })

        const [weeklyResponse, chartResponse] = await Promise.all([
          fetch('/admin/dashboard/weekly-summary', {
            method: 'GET',
            signal: controller.signal,
          }),
          fetch(`/admin/dashboard/chart?${chartQuery.toString()}`, {
            method: 'GET',
            signal: controller.signal,
          }),
        ])

        if (!weeklyResponse.ok) {
          throw new Error(`Failed to fetch weekly summary: ${weeklyResponse.status}`)
        }
        if (!chartResponse.ok) {
          throw new Error(`Failed to fetch dashboard chart: ${chartResponse.status}`)
        }

        const [weeklyResult, chartResult]: [WeeklySummaryResponse, DashboardChartResponse] =
          await Promise.all([weeklyResponse.json(), chartResponse.json()])

        setWeeklyReportCount(weeklyResult.data.weeklyReportCount ?? 0)
        setWeeklyActiveUserCount(weeklyResult.data.weeklyNewWorkerCount ?? 0)
        setWorkspaceGrowthRate(chartResult.data.workspaceChart.yearOverYearGrowthRate ?? 0)
        setMemberGrowthRate(chartResult.data.memberChart.yearOverYearGrowthRate ?? 0)
        setWorkspaceDataPoints(chartResult.data.workspaceChart.dataPoints ?? [])
        setMemberDataPoints(chartResult.data.memberChart.dataPoints ?? [])
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setWeeklyReportCount(0)
          setWeeklyActiveUserCount(0)
          setWorkspaceGrowthRate(0)
          setMemberGrowthRate(0)
          setWorkspaceDataPoints([])
          setMemberDataPoints([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()

    return () => controller.abort()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex min-w-0 flex-1 flex-col">
          <TopBar />

          <div className="flex-1 px-8 pb-10">
            <div className="grid grid-cols-12 gap-6">
              {/* 왼쪽 큰 카드 라인 */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-[28px]">
                <EntityGrowthCard
                  growthRate={workspaceGrowthRate}
                  dataPoints={workspaceDataPoints}
                  loading={loading}
                />
                <CommunityMetricsCard
                  growthRate={memberGrowthRate}
                  dataPoints={memberDataPoints}
                  loading={loading}
                />
              </div>

              {/* 오른쪽 사이드 라인 */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <LiveFeedCard reportCount={weeklyReportCount} loading={loading} />
                <WeeklyActiveUsersCard
                  activeUserCount={weeklyActiveUserCount}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
