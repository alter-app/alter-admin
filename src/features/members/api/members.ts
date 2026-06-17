import authInstance from '@/shared/lib/axiosInstance'
import type {
  MemberDetail,
  MemberDetailApiResponse,
  MembersListResponse,
  MembersParams,
  UpdatePasswordRequest,
  UpdateStatusRequest,
} from '../types'

export async function getMembers(params: MembersParams): Promise<MembersListResponse> {
  const res = await authInstance.get<MembersListResponse>('/admin/users', { params })
  return res.data
}

export async function getMember(userId: number): Promise<MemberDetail> {
  const res = await authInstance.get<MemberDetailApiResponse>(`/admin/users/${userId}`)
  return res.data.data
}

export async function updateMemberStatus(userId: number, body: UpdateStatusRequest): Promise<void> {
  await authInstance.put(`/admin/users/${userId}/status`, body)
}

export async function updateMemberPassword(userId: number, body: UpdatePasswordRequest): Promise<void> {
  await authInstance.put(`/admin/users/${userId}/password`, body)
}
