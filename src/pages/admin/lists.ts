import {
  badge,
  jobs,
  members,
  pages,
  reports,
  terms,
  wsManage,
  wsRequests,
} from '@/shared/admin/data'
import type { PageBtn } from '@/shared/admin/data'
import type {
  ConfirmCfg,
  Detail,
  MenuKey,
  WorkspaceSub,
} from '@/shared/stores/useAdminStore'

export type Align = 'left' | 'center' | 'right'

export interface Column {
  label: string
  align: Align
  width: string
}

export interface TextCell {
  kind: 'text'
  text: string
  align: Align
  color: string
  weight: number
}

export interface BadgeCell {
  kind: 'badge'
  text: string
  bg: string
  fg: string
  align: Align
}

export type Cell = TextCell | BadgeCell

export interface Row {
  onOpen: () => void
  cells: Cell[]
}

export interface FilterSelect {
  kind: 'select'
  label: string
  options: string[]
}

export interface FilterInput {
  kind: 'input'
  label: string
  placeholder: string
}

export type Filter = FilterSelect | FilterInput

export interface Tab {
  label: string
  on: () => void
  fg: string
  bar: string
}

export interface ListConfig {
  title: string
  columns: Column[]
  rows: Row[]
  filters: Filter[]
  pages: PageBtn[]
  hasPrimary?: boolean
  primaryLabel?: string
  onPrimary?: () => void
  tabs?: Tab[]
  isMock?: boolean // true → show '미연동 · 예시' badge
}

export interface ListActions {
  openDetail: (detail: Detail) => void
  openConfirm: (cfg: ConfirmCfg) => void
  selectWorkspaceSub: (sub: WorkspaceSub) => void
}

const tab = (active: boolean, label: string, on: () => void): Tab => ({
  label,
  on,
  fg: active ? '#07c079' : '#828282',
  bar: active ? '#07c079' : 'transparent',
})

function membersList(a: ListActions): ListConfig {
  return {
    title: '회원 관리',
    columns: [
      { label: '이메일', align: 'left', width: '22%' },
      { label: '이름', align: 'left', width: '10%' },
      { label: '닉네임', align: 'left', width: '12%' },
      { label: '권한', align: 'center', width: '12%' },
      { label: '상태', align: 'center', width: '12%' },
      { label: '가입일', align: 'right', width: '16%' },
    ],
    rows: members.map(m => {
      const rb = badge(m.roleTone)
      const sb = badge(m.statusTone)
      return {
        onOpen: () => a.openDetail({ type: 'member', row: m }),
        cells: [
          { kind: 'text', text: m.email, align: 'left', color: '#232323', weight: 600 },
          { kind: 'text', text: m.name, align: 'left', color: '#5f5f5f', weight: 400 },
          { kind: 'text', text: m.nickname, align: 'left', color: '#828282', weight: 400 },
          { kind: 'badge', text: m.role, bg: rb.bg, fg: rb.fg, align: 'center' },
          { kind: 'badge', text: m.status, bg: sb.bg, fg: sb.fg, align: 'center' },
          { kind: 'text', text: m.createdAt, align: 'right', color: '#828282', weight: 400 },
        ],
      }
    }),
    pages: pages(4, 1),
    filters: [
      { kind: 'select', label: '상태', options: ['전체', '활성', '정지', '삭제됨'] },
      { kind: 'select', label: '권한', options: ['전체', '일반', '매니저', '관리자'] },
      { kind: 'input', label: '검색', placeholder: '이메일 / 이름 / 닉네임 / 연락처' },
    ],
  }
}

function jobsList(a: ListActions): ListConfig {
  return {
    title: '공고 관리',
    columns: [
      { label: '공고 제목', align: 'left', width: '34%' },
      { label: '업장명', align: 'left', width: '18%' },
      { label: '게시 상태', align: 'center', width: '12%' },
      { label: '지원자', align: 'center', width: '10%' },
      { label: '등록일', align: 'right', width: '14%' },
    ],
    rows: jobs.map(j => {
      const b = badge(j.tone)
      return {
        onOpen: () => a.openDetail({ type: 'job', row: j }),
        cells: [
          { kind: 'text', text: j.title, align: 'left', color: '#232323', weight: 600 },
          { kind: 'text', text: j.workspace, align: 'left', color: '#5f5f5f', weight: 400 },
          { kind: 'badge', text: j.status, bg: b.bg, fg: b.fg, align: 'center' },
          { kind: 'text', text: `${j.applicants}명`, align: 'center', color: '#5f5f5f', weight: 400 },
          { kind: 'text', text: j.createdAt, align: 'right', color: '#828282', weight: 400 },
        ],
      }
    }),
    pages: pages(3, 1),
    filters: [
      { kind: 'select', label: '게시 상태', options: ['전체', '게시중', '검토중', '마감', '비활성'] },
      { kind: 'input', label: '검색', placeholder: '공고 제목 / 업장명' },
    ],
    isMock: true,
  }
}

function wsRequestsList(a: ListActions): ListConfig {
  return {
    title: '업장 관리',
    columns: [
      { label: '업장명', align: 'left', width: '26%' },
      { label: '주소', align: 'left', width: '38%' },
      { label: '신청일', align: 'center', width: '16%' },
      { label: '상태', align: 'right', width: '16%' },
    ],
    rows: wsRequests.map(w => {
      const b = badge(w.tone)
      return {
        onOpen: () => a.openDetail({ type: 'wsRequest', row: w }),
        cells: [
          { kind: 'text', text: w.businessName, align: 'left', color: '#232323', weight: 600 },
          { kind: 'text', text: w.fullAddress, align: 'left', color: '#5f5f5f', weight: 400 },
          { kind: 'text', text: w.createdAt, align: 'center', color: '#828282', weight: 400 },
          { kind: 'badge', text: w.status, bg: b.bg, fg: b.fg, align: 'right' },
        ],
      }
    }),
    pages: pages(2, 1),
    filters: [
      { kind: 'select', label: '상태', options: ['전체', '승인대기', '활성화', '반려'] },
      { kind: 'input', label: '검색', placeholder: '업장명 / 주소' },
    ],
  }
}

function wsManageList(a: ListActions): ListConfig {
  return {
    title: '업장 관리',
    columns: [
      { label: '업장명', align: 'left', width: '26%' },
      { label: '주소', align: 'left', width: '34%' },
      { label: '상태', align: 'center', width: '12%' },
      { label: '근무자', align: 'center', width: '12%' },
      { label: '등록일', align: 'right', width: '14%' },
    ],
    rows: wsManage.map(w => {
      const b = badge(w.tone)
      return {
        onOpen: () => a.openDetail({ type: 'wsManage', row: w }),
        cells: [
          { kind: 'text', text: w.name, align: 'left', color: '#232323', weight: 600 },
          { kind: 'text', text: w.address, align: 'left', color: '#5f5f5f', weight: 400 },
          { kind: 'badge', text: w.status, bg: b.bg, fg: b.fg, align: 'center' },
          { kind: 'text', text: `${w.workers}명`, align: 'center', color: '#5f5f5f', weight: 400 },
          { kind: 'text', text: w.createdAt, align: 'right', color: '#828282', weight: 400 },
        ],
      }
    }),
    pages: pages(2, 1),
    filters: [
      { kind: 'select', label: '상태', options: ['전체', '영업중', '휴업', '정지'] },
      { kind: 'input', label: '검색', placeholder: '업장명 / 주소' },
    ],
    isMock: true,
  }
}

function reportsList(a: ListActions): ListConfig {
  return {
    title: '신고 관리',
    columns: [
      { label: '대상 유형', align: 'left', width: '14%' },
      { label: '대상', align: 'left', width: '30%' },
      { label: '상태', align: 'center', width: '14%' },
      { label: '신고일', align: 'right', width: '16%' },
    ],
    rows: reports.map(r => {
      const b = badge(r.tone)
      return {
        onOpen: () => a.openDetail({ type: 'report', row: r }),
        cells: [
          { kind: 'badge', text: r.targetType, bg: '#e9eefc', fg: '#003BDC', align: 'left' },
          { kind: 'text', text: r.targetName, align: 'left', color: '#232323', weight: 600 },
          { kind: 'badge', text: r.status, bg: b.bg, fg: b.fg, align: 'center' },
          { kind: 'text', text: r.createdAt, align: 'right', color: '#828282', weight: 400 },
        ],
      }
    }),
    pages: pages(3, 1),
    filters: [
      { kind: 'select', label: '대상 유형', options: ['전체', '사용자', '평판', '공고', '업장'] },
      { kind: 'select', label: '상태', options: ['전체', '대기중', '처리중', '완료', '거부됨'] },
    ],
  }
}

function termsList(a: ListActions): ListConfig {
  return {
    title: '약관 관리',
    columns: [
      { label: '구분', align: 'left', width: '18%' },
      { label: '버전', align: 'center', width: '10%' },
      { label: '제목', align: 'left', width: '30%' },
      { label: '필수', align: 'center', width: '10%' },
      { label: '상태', align: 'center', width: '12%' },
      { label: '시행일', align: 'right', width: '14%' },
    ],
    rows: terms.map(t => {
      const b = badge(t.tone)
      const req = t.required === '필수' ? badge('blue') : badge('gray')
      return {
        onOpen: () =>
          a.openConfirm({
            title: t.title,
            desc: '약관 수정/게시 화면으로 이동합니다. (예시)',
            label: '편집',
            color: '#07c079',
          }),
        cells: [
          { kind: 'text', text: t.type, align: 'left', color: '#232323', weight: 600 },
          { kind: 'text', text: t.version, align: 'center', color: '#5f5f5f', weight: 400 },
          { kind: 'text', text: t.title, align: 'left', color: '#5f5f5f', weight: 400 },
          { kind: 'badge', text: t.required, bg: req.bg, fg: req.fg, align: 'center' },
          { kind: 'badge', text: t.status, bg: b.bg, fg: b.fg, align: 'center' },
          { kind: 'text', text: t.effectiveAt, align: 'right', color: '#828282', weight: 400 },
        ],
      }
    }),
    pages: pages(2, 1),
    hasPrimary: true,
    primaryLabel: '+ 약관 생성',
    onPrimary: () =>
      a.openConfirm({
        title: '약관 생성',
        desc: '신규 약관 작성 폼으로 이동합니다. (예시)',
        label: '작성',
        color: '#07c079',
      }),
    filters: [
      {
        kind: 'select',
        label: '구분',
        options: ['전체', '서비스 이용약관', '개인정보 처리방침', '위치정보', '마케팅'],
      },
      { kind: 'select', label: '상태', options: ['전체', '작성중', '게시됨', '폐기됨'] },
    ],
  }
}

export function buildListConfig(
  menu: MenuKey,
  workspaceSub: WorkspaceSub,
  actions: ListActions
): ListConfig | null {
  switch (menu) {
    case 'members':
      return membersList(actions)
    case 'jobs':
      return jobsList(actions)
    case 'reports':
      return reportsList(actions)
    case 'terms':
      return termsList(actions)
    case 'workspaces': {
      const config =
        workspaceSub === 'requests'
          ? wsRequestsList(actions)
          : wsManageList(actions)
      config.tabs = [
        tab(workspaceSub === 'requests', '업장 등록 신청', () =>
          actions.selectWorkspaceSub('requests')
        ),
        tab(workspaceSub === 'manage', '업장 관리', () =>
          actions.selectWorkspaceSub('manage')
        ),
      ]
      return config
    }
    default:
      return null
  }
}
