import type { OffsetPage } from '@/shared/types/common'

export interface DescribedEnum {
  value: string
  description: string
}

export interface TermsListItem {
  id: number
  type: DescribedEnum
  version: string
  title: string
  required: boolean
  status: DescribedEnum
  effectiveAt: string
  createdAt: string
}

export interface TermsDetail {
  id: number
  type: DescribedEnum
  version: string
  title: string
  docUrl: string
  required: boolean
  status: DescribedEnum
  effectiveAt: string
  createdAt: string
  updatedAt: string
}

export interface TermsListResponse {
  page: OffsetPage
  data: TermsListItem[]
}

// No CommonApiResponse wrapper for list
export type TermsApiResponse = TermsListResponse

export interface TermsParams {
  page: number
  pageSize: number
  type?: string
  status?: string
}
