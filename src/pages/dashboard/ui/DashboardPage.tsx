import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { CommunityMetricsCard } from './cards/CommunityMetricsCard'
import { EntityGrowthCard } from './cards/EntityGrowthCard'
import { LiveFeedCard } from './cards/LiveFeedCard'
import { MonthlyAvgCard } from './cards/MonthlyAvgCard'
import { WeeklyActiveUsersCard } from './cards/WeeklyActiveUsersCard'

export function DashboardPage() {
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
                <EntityGrowthCard />
                <CommunityMetricsCard />
              </div>

              {/* 오른쪽 사이드 라인 */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <LiveFeedCard />
                <MonthlyAvgCard />
                <WeeklyActiveUsersCard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
