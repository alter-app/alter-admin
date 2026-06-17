import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import {
  createWorkspaceComment,
  getWorkspaceComments,
  getWorkspaceRequest,
  getWorkspaceRequests,
  updateWorkspaceRequestStatus,
} from '../api/workspaceRequests'
import type {
  CreateCommentRequest,
  UpdateStatusRequest,
  WsRequestsParams,
} from '../types'

export function useWorkspaceRequests(params: WsRequestsParams) {
  return useQuery({
    queryKey: queryKeys.workspaceRequests.list(
      params as unknown as Record<string, unknown>
    ),
    queryFn: () => getWorkspaceRequests(params),
    staleTime: 30_000,
  })
}

export function useWorkspaceRequest(id: number) {
  return useQuery({
    queryKey: queryKeys.workspaceRequests.detail(id),
    queryFn: () => getWorkspaceRequest(id),
    staleTime: 30_000,
  })
}

export function useWorkspaceComments(id: number) {
  return useQuery({
    queryKey: queryKeys.workspaceRequests.comments(id),
    queryFn: () => getWorkspaceComments(id),
    staleTime: 30_000,
  })
}

export function useUpdateWorkspaceRequestStatus(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateStatusRequest) =>
      updateWorkspaceRequestStatus(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceRequests'] })
    },
  })
}

export function useCreateWorkspaceComment(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateCommentRequest) =>
      createWorkspaceComment(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaceRequests'] })
    },
  })
}
