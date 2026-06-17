import authInstance from '@/shared/lib/axiosInstance'
import type {
  CreateCommentRequest,
  UpdateStatusRequest,
  WsComment,
  WsCommentsApiResponse,
  WsRequestDetail,
  WsRequestDetailApiResponse,
  WsRequestsApiResponse,
  WsRequestsListResponse,
  WsRequestsParams,
} from '../types'

export async function getWorkspaceRequests(
  params: WsRequestsParams
): Promise<WsRequestsListResponse> {
  const res = await authInstance.get<WsRequestsApiResponse>(
    '/admin/workspace-requests',
    { params }
  )
  return res.data.data
}

export async function getWorkspaceRequest(
  id: number
): Promise<WsRequestDetail> {
  const res = await authInstance.get<WsRequestDetailApiResponse>(
    `/admin/workspace-requests/${id}`
  )
  return res.data.data
}

export async function updateWorkspaceRequestStatus(
  id: number,
  body: UpdateStatusRequest
): Promise<void> {
  await authInstance.patch(`/admin/workspace-requests/${id}/status`, body)
}

export async function getWorkspaceComments(id: number): Promise<WsComment[]> {
  const res = await authInstance.get<WsCommentsApiResponse>(
    `/admin/workspace-requests/${id}/comments`
  )
  return res.data.data
}

export async function createWorkspaceComment(
  id: number,
  body: CreateCommentRequest
): Promise<void> {
  await authInstance.post(`/admin/workspace-requests/${id}/comments`, body)
}
