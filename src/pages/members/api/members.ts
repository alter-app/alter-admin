import axiosInstance from '@/shared/lib/axiosInstance'

export type MemberRole = 'ROLE_USER' | 'ROLE_MANAGER' | 'ROLE_ADMIN'
export type MemberStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED'

export type Member = {
  id: number
  email: string
  name: string
  nickname: string
  role: { value: MemberRole; description: string }
  status: { value: MemberStatus; description: string }
  createdAt: string
}

export type MembersResponse = {
  page: {
    page: number
    pageSize: number
    totalCount: number
    totalPage: number
  }
  data: Member[]
}

type FetchMembersParams = {
  page: number
  pageSize: number
  status?: MemberStatus
  role?: MemberRole
  name?: string
  email?: string
  nickname?: string
  contact?: string
  signal?: AbortSignal
}

type GenderValue = 'GENDER_MALE' | 'GENDER_FEMALE'

type ReputationKeyword = {
  id: string
  emoji: string
  description: string
  count: number
}

export type MemberDetail = {
  id: number
  email: string
  name: string
  nickname: string
  contact: string
  birthday: string
  gender: { value: GenderValue; description: string }
  role: { value: MemberRole; description: string }
  status: { value: MemberStatus; description: string }
  createdAt: string
  updatedAt: string
  reputationSummary: { topKeywords: ReputationKeyword[] } | null
}

type MemberDetailResponse = {
  timestamp: string
  data: MemberDetail
}

export async function updateMemberStatus(id: number, status: MemberStatus): Promise<void> {
  await axiosInstance.put(`/admin/users/${id}/status`, { status })
}

export async function updateMemberPassword(id: number, newPassword: string): Promise<void> {
  await axiosInstance.put(`/admin/users/${id}/password`, { newPassword })
}

export async function fetchMemberDetail(id: number, signal?: AbortSignal): Promise<MemberDetail> {
  const { data: result } = await axiosInstance.get<MemberDetailResponse>(`/admin/users/${id}`, { signal })
  return result.data
}

export async function fetchMembers(params: FetchMembersParams): Promise<MembersResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  })
  if (params.status)   query.set('status', params.status)
  if (params.role)     query.set('role', params.role)
  if (params.name)     query.set('name', params.name)
  if (params.email)    query.set('email', params.email)
  if (params.nickname) query.set('nickname', params.nickname)
  if (params.contact)  query.set('contact', params.contact)

  const { data } = await axiosInstance.get<MembersResponse>(`/admin/users?${query.toString()}`, {
    signal: params.signal,
  })
  return data
}
