import type { CommonApiResponse, OffsetPage } from '@/shared/types/common'

export interface DescribedEnum {
  value: string
  description: string
}

export interface ReputationKeyword {
  emoji?: string
  description: string
  count: number
}

export interface ReputationSummary {
  topKeywords: ReputationKeyword[]
}

export interface MemberListItem {
  id: number
  email: string
  name: string
  nickname: string
  role: DescribedEnum
  status: DescribedEnum
  createdAt: string
}

export interface MemberDetail {
  id: number
  email: string
  name: string
  nickname: string
  contact: string
  birthday: string
  gender: DescribedEnum
  role: DescribedEnum
  status: DescribedEnum
  createdAt: string
  updatedAt: string
  reputationSummary: ReputationSummary
}

export interface MembersListResponse {
  page: OffsetPage
  data: MemberListItem[]
}

export type MembersApiResponse = MembersListResponse // no CommonApiResponse wrapper
export type MemberDetailApiResponse = CommonApiResponse<MemberDetail>

export interface MembersParams {
  page: number
  pageSize: number
  status?: string
  role?: string
  email?: string
  name?: string
  nickname?: string
  contact?: string
}

export interface UpdateStatusRequest {
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
}

export interface UpdatePasswordRequest {
  newPassword: string
}
