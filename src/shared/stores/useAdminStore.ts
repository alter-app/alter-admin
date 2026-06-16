import { create } from 'zustand'
import type {
  Job,
  Member,
  Metric,
  Period,
  Report,
  WsManage,
  WsRequest,
} from '@/shared/admin/data'

export type MenuKey =
  | 'dashboard'
  | 'members'
  | 'jobs'
  | 'workspaces'
  | 'reports'
  | 'terms'
  | 'system'

export type WorkspaceSub = 'requests' | 'manage'

export type Detail =
  | { type: 'member'; row: Member }
  | { type: 'job'; row: Job }
  | { type: 'wsRequest'; row: WsRequest }
  | { type: 'wsManage'; row: WsManage }
  | { type: 'report'; row: Report }

export type ModalKind = 'password' | 'reject' | 'confirm' | null

export interface ConfirmCfg {
  title: string
  desc: string
  label: string
  color: string
}

interface AdminState {
  menu: MenuKey
  workspaceSub: WorkspaceSub
  detail: Detail | null
  modal: ModalKind
  confirmCfg: ConfirmCfg | null
  chartMetric: Metric
  period: Period
  collapsed: boolean
  userMenuOpen: boolean
  selectMenu: (menu: MenuKey) => void
  selectWorkspaceSub: (sub: WorkspaceSub) => void
  openDetail: (detail: Detail) => void
  back: () => void
  toggleSidebar: () => void
  toggleUserMenu: () => void
  setMetric: (metric: Metric) => void
  setPeriod: (period: Period) => void
  openPasswordModal: () => void
  openRejectModal: () => void
  openConfirm: (cfg: ConfirmCfg) => void
  closeModal: () => void
  openLogout: () => void
}

export const useAdminStore = create<AdminState>(set => ({
  menu: 'dashboard',
  workspaceSub: 'requests',
  detail: null,
  modal: null,
  confirmCfg: null,
  chartMetric: 'members',
  period: 'monthly',
  collapsed: false,
  userMenuOpen: false,

  selectMenu: menu => set({ menu, detail: null, userMenuOpen: false }),
  selectWorkspaceSub: sub => set({ workspaceSub: sub, detail: null }),
  openDetail: detail => set({ detail }),
  back: () => set({ detail: null }),
  toggleSidebar: () => set(s => ({ collapsed: !s.collapsed })),
  toggleUserMenu: () => set(s => ({ userMenuOpen: !s.userMenuOpen })),
  setMetric: metric => set({ chartMetric: metric }),
  setPeriod: period => set({ period }),

  openPasswordModal: () => set({ modal: 'password', userMenuOpen: false }),
  openRejectModal: () => set({ modal: 'reject' }),
  openConfirm: cfg => set({ modal: 'confirm', confirmCfg: cfg }),
  closeModal: () => set({ modal: null }),
  openLogout: () =>
    set({
      modal: 'confirm',
      userMenuOpen: false,
      confirmCfg: {
        title: '로그아웃',
        desc: '관리자 계정에서 로그아웃하시겠어요?',
        label: '로그아웃',
        color: '#dc0000',
      },
    }),
}))
