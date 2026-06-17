import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getMember, getMembers, updateMemberPassword, updateMemberStatus } from '../api/members'
import type { MembersParams, UpdatePasswordRequest, UpdateStatusRequest } from '../types'

export function useMembers(params: MembersParams) {
  return useQuery({
    queryKey: queryKeys.members.list(params as unknown as Record<string, unknown>),
    queryFn: () => getMembers(params),
    staleTime: 30_000,
  })
}

export function useMember(userId: number) {
  return useQuery({
    queryKey: queryKeys.members.detail(userId),
    queryFn: () => getMember(userId),
    staleTime: 30_000,
  })
}

export function useUpdateMemberStatus(userId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateStatusRequest) => updateMemberStatus(userId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
    },
  })
}

export function useUpdateMemberPassword(userId: number) {
  return useMutation({
    mutationFn: (body: UpdatePasswordRequest) => updateMemberPassword(userId, body),
  })
}
