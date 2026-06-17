import type { CommonApiResponse, OffsetPage } from '@/shared/types/common'

export interface DescribedEnum {
  value: string
  description: string
}

export interface WsRequestListItem {
  id: number
  businessName: string
  fullAddress: string
  createdAt: string
  status: DescribedEnum
}

export interface WsRequestDetail {
  id: number
  businessRegistrationNo: string
  businessName: string
  businessType: string
  contact: string
  status: DescribedEnum
  fullAddress: string
  latitude: number
  longitude: number
  workspaceCertFileId: string
  workspaceOwnIdentityFileId: string
  workspaceWarrantFileId: string
  createdAt: string
  updatedAt: string
}

export interface WsRequestsListResponse {
  page: OffsetPage
  data: WsRequestListItem[]
}

// This group IS wrapped in CommonApiResponse
export type WsRequestsApiResponse = CommonApiResponse<WsRequestsListResponse>
export type WsRequestDetailApiResponse = CommonApiResponse<WsRequestDetail>

export interface WsRequestsParams {
  page: number
  pageSize: number
}

export type CommentOwner = 'USER' | 'ADMIN'

export interface WsCommentFile {
  fileId: string
  url: string
}

export interface WsComment {
  id: number
  userId: number
  commentOwner: CommentOwner
  comment: string
  files: WsCommentFile[]
  createdAt: string
}

export type WsCommentsApiResponse = CommonApiResponse<WsComment[]>

export interface CreateCommentRequest {
  comment: string
  fileIds?: string[]
}

export type WsRequestStatusValue = 'ACTIVATED' | 'REVOKED'

export interface UpdateStatusRequest {
  status: WsRequestStatusValue
}
