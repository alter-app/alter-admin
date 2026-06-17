import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/shared/lib/queryKeys'
import { getTerm, getTermsList, publishTerm } from '../api/terms'
import type { TermsParams } from '../types'

export function useTermsList(params: TermsParams) {
  return useQuery({
    queryKey: queryKeys.terms.list(params as unknown as Record<string, unknown>),
    queryFn: () => getTermsList(params),
    staleTime: 30_000,
  })
}

export function useTerm(id: number) {
  return useQuery({
    queryKey: queryKeys.terms.detail(id),
    queryFn: () => getTerm(id),
    staleTime: 30_000,
    enabled: id > 0,
  })
}

export function usePublishTerm(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => publishTerm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] })
    },
  })
}
