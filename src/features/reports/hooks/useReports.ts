import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { deleteReport, getReport, getReports, updateReportStatus } from '../api/reports'
import type { ReportsParams, UpdateReportStatusRequest } from '../types'

export function useReports(params: Omit<ReportsParams, 'cursor'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.reports.list(params as Record<string, unknown>),
    queryFn: ({ pageParam }) =>
      getReports({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.page.cursor ?? undefined,
  })
}

export function useReport(reportId: number) {
  return useQuery({
    queryKey: queryKeys.reports.detail(reportId),
    queryFn: () => getReport(reportId),
    staleTime: 30_000,
  })
}

export function useUpdateReportStatus(reportId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateReportStatusRequest) => updateReportStatus(reportId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}

export function useDeleteReport(reportId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => deleteReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
    },
  })
}
