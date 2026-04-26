import axiosInstance from '@/shared/lib/axiosInstance'

export type ReportTargetType = 'USER' | 'REPUTATION' | 'POSTING' | 'WORKSPACE'
export type ReportStatus = 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REJECTED' | 'CANCELLED' | 'DELETED'

export type Report = {
  id: number
  targetType: ReportTargetType
  targetName: string
  status: ReportStatus
  createdAt: string
}

export type ReportDetail = {
  id: number
  targetType: ReportTargetType
  target: {
    targetId: number
    targetName: string
  }
  reason: string
  status: ReportStatus
  adminComment: string | null
  createdAt: string
  updatedAt: string
}

export type ReportsResponse = {
  page: {
    cursor: string | null
    pageSize: number
    totalCount: number
  }
  data: Report[]
}

type FetchReportsParams = {
  cursor?: string | null
  pageSize: number
  targetType?: ReportTargetType
  status?: ReportStatus
  signal?: AbortSignal
}

export async function fetchReports(params: FetchReportsParams): Promise<ReportsResponse> {
  const query = new URLSearchParams({ pageSize: String(params.pageSize) })
  if (params.cursor)     query.set('cursor', params.cursor)
  if (params.targetType) query.set('targetType', params.targetType)
  if (params.status)     query.set('status', params.status)

  const { data } = await axiosInstance.get<ReportsResponse>(`/admin/reports?${query.toString()}`, {
    signal: params.signal,
  })
  return data
}

export async function fetchReportDetail(reportId: number, signal?: AbortSignal): Promise<ReportDetail> {
  const { data } = await axiosInstance.get<{ data: ReportDetail }>(`/admin/reports/${reportId}`, { signal })
  return data.data
}
