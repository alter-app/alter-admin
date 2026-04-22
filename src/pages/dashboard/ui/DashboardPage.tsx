import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { CommunityMetricsCard } from './cards/CommunityMetricsCard'
import { EntityGrowthCard } from './cards/EntityGrowthCard'
import { LiveFeedCard } from './cards/LiveFeedCard'
import { WeeklyActiveUsersCard } from './cards/WeeklyActiveUsersCard'
import { useAuthStore } from '@/shared/stores/useAuthStore'
import axiosInstance from '@/shared/lib/axiosInstance'

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
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const [weeklyReportCount, setWeeklyReportCount] = useState(0)
  const [weeklyActiveUserCount, setWeeklyActiveUserCount] = useState(0)
  const [workspaceGrowthRate, setWorkspaceGrowthRate] = useState(0)
  const [memberGrowthRate, setMemberGrowthRate] = useState(0)
  const [workspaceDataPoints, setWorkspaceDataPoints] = useState<ChartDataPoint[]>([])
  const [memberDataPoints, setMemberDataPoints] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

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
          axiosInstance.get<WeeklySummaryResponse>('/admin/dashboard/weekly-summary', {
            signal: controller.signal,
          }),
          axiosInstance.get<DashboardChartResponse>(`/admin/dashboard/chart?${chartQuery.toString()}`, {
            signal: controller.signal,
          }),
        ])

        setWeeklyReportCount(weeklyResponse.data.data.weeklyReportCount ?? 0)
        setWeeklyActiveUserCount(weeklyResponse.data.data.weeklyNewWorkerCount ?? 0)
        setWorkspaceGrowthRate(chartResponse.data.data.workspaceChart.yearOverYearGrowthRate ?? 0)
        setMemberGrowthRate(chartResponse.data.data.memberChart.yearOverYearGrowthRate ?? 0)
        setWorkspaceDataPoints(chartResponse.data.data.workspaceChart.dataPoints ?? [])
        setMemberDataPoints(chartResponse.data.data.memberChart.dataPoints ?? [])
        setLoading(false)
      } catch (error) {
        if ((error as Error).name === 'CanceledError') return
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
          <TopBar onLogout={handleLogout} />

          <div className="flex-1 px-8 pb-10">
            <div className="grid grid-cols-12 gap-6">
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
