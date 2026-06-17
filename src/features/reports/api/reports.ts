import authInstance from '@/shared/lib/axiosInstance'
import type {
  ReportDetail,
  ReportDetailApiResponse,
  ReportsListResponse,
  ReportsParams,
  UpdateReportStatusRequest,
} from '../types'

export async function getReports(params: ReportsParams): Promise<ReportsListResponse> {
  const res = await authInstance.get<ReportsListResponse>('/admin/reports', { params })
  return res.data
}

export async function getReport(reportId: number): Promise<ReportDetail> {
  const res = await authInstance.get<ReportDetailApiResponse>(`/admin/reports/${reportId}`)
  return res.data.data
}

export async function updateReportStatus(reportId: number, body: UpdateReportStatusRequest): Promise<void> {
  await authInstance.put(`/admin/reports/${reportId}/status`, body)
}

export async function deleteReport(reportId: number): Promise<void> {
  await authInstance.delete(`/admin/reports/${reportId}`)
}
