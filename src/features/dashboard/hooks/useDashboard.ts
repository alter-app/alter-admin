import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getDashboardChart, getWeeklySummary } from '../api/dashboard'

export function useDashboardChart(period: string, year: number) {
  return useQuery({
    queryKey: queryKeys.dashboard.chart(period, year),
    queryFn: () => getDashboardChart(period, year),
    staleTime: 60_000,
  })
}

export function useWeeklySummary() {
  return useQuery({
    queryKey: queryKeys.dashboard.weekly(),
    queryFn: getWeeklySummary,
    staleTime: 60_000,
  })
}
