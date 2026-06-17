import type { CommonApiResponse } from '@/shared/types/common'

export interface DataPoint {
  label: string
  value: number
}

export interface ChartData {
  period: string
  year: number
  yearOverYearGrowthRate: number
  dataPoints: DataPoint[]
}

export interface DashboardChartResponse {
  workspaceChart: ChartData
  memberChart: ChartData
}

export interface WeeklySummaryResponse {
  weeklyReportCount: number
  weeklyNewWorkerCount: number
}

export type DashboardChartApiResponse = CommonApiResponse<DashboardChartResponse>
export type WeeklySummaryApiResponse = CommonApiResponse<WeeklySummaryResponse>
