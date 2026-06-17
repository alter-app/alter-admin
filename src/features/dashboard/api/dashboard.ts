import authInstance from '@/shared/lib/axiosInstance'
import type { DashboardChartApiResponse, DashboardChartResponse, WeeklySummaryApiResponse, WeeklySummaryResponse } from '../types'

export async function getDashboardChart(period: string, year: number): Promise<DashboardChartResponse> {
  const res = await authInstance.get<DashboardChartApiResponse>('/admin/dashboard/chart', {
    params: { period, year },
  })
  return res.data.data
}

export async function getWeeklySummary(): Promise<WeeklySummaryResponse> {
  const res = await authInstance.get<WeeklySummaryApiResponse>('/admin/dashboard/weekly-summary')
  return res.data.data
}
