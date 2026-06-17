export const queryKeys = {
  dashboard: {
    chart: (period: string, year: number) =>
      ['dashboard', 'chart', period, year] as const,
    weekly: () => ['dashboard', 'weekly'] as const,
  },
  members: {
    list: (params: Record<string, unknown>) =>
      ['members', 'list', params] as const,
    detail: (id: number) => ['members', 'detail', id] as const,
  },
  reports: {
    list: (params: Record<string, unknown>) =>
      ['reports', 'list', params] as const,
    detail: (id: number) => ['reports', 'detail', id] as const,
  },
  workspaceRequests: {
    list: (params: Record<string, unknown>) =>
      ['workspaceRequests', 'list', params] as const,
    detail: (id: number) => ['workspaceRequests', 'detail', id] as const,
    comments: (id: number) => ['workspaceRequests', 'comments', id] as const,
  },
  terms: {
    list: (params: Record<string, unknown>) =>
      ['terms', 'list', params] as const,
    detail: (id: number) => ['terms', 'detail', id] as const,
  },
} as const
