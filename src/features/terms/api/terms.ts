import authInstance from '@/shared/lib/axiosInstance'
import type { CommonApiResponse } from '@/shared/types/common'
import type { TermsDetail, TermsListResponse, TermsParams } from '../types'

export async function getTermsList(params: TermsParams): Promise<TermsListResponse> {
  const res = await authInstance.get<TermsListResponse>('/admin/terms', { params })
  return res.data
}

export async function getTerm(id: number): Promise<TermsDetail> {
  const res = await authInstance.get<CommonApiResponse<TermsDetail>>(`/admin/terms/${id}`)
  return res.data.data
}

export async function publishTerm(id: number): Promise<void> {
  await authInstance.patch(`/admin/terms/${id}/publish`)
}
