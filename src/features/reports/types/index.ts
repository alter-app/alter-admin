import type { CommonApiResponse, CursorPage } from '@/shared/types/common'

export interface DescribedEnum {
  value: string
  description: string
}

export interface ReportTarget {
  targetId: number
  targetName: string
}

export interface ReportListItem {
  id: number
  targetType: DescribedEnum
  targetName: string
  status: DescribedEnum
  createdAt: string
}

export interface ReportDetail {
  id: number
  targetType: DescribedEnum
  target: ReportTarget
  reason: string
  status: DescribedEnum
  adminComment: string
  createdAt: string
  updatedAt: string
}

export interface ReportsListResponse {
  page: CursorPage
  data: ReportListItem[]
}

// cursor-paginated — no CommonApiResponse wrapper
export type ReportsApiResponse = ReportsListResponse
export type ReportDetailApiResponse = CommonApiResponse<ReportDetail>

export interface ReportsParams {
  cursor?: string
  pageSize: number
  targetType?: string
  status?: string
}

export interface UpdateReportStatusRequest {
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'REJECTED' | 'CANCELLED' | 'DELETED'
  adminComment?: string
}
