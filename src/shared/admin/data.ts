// 어드민 화면용 목업 데이터 · 상태 배지 톤 · 차트 시리즈
// (백엔드 API 미연동 구간은 모두 이 목업 데이터로 채운다)

export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'gray'

export interface BadgePair {
  bg: string
  fg: string
}

export const TONES: Record<Tone, BadgePair> = {
  green: { bg: '#e6f9f2', fg: '#0f7745' },
  amber: { bg: '#fdf3e2', fg: '#b9740a' },
  red: { bg: '#fdeaea', fg: '#dc0000' },
  blue: { bg: '#e9eefc', fg: '#003BDC' },
  gray: { bg: '#efefef', fg: '#5f5f5f' },
}

export const badge = (tone: Tone): BadgePair => TONES[tone] ?? TONES.gray

export interface Member {
  id: number
  email: string
  name: string
  nickname: string
  role: string
  roleTone: Tone
  status: string
  statusTone: Tone
  createdAt: string
  contact: string
  birthday: string
  gender: string
  updatedAt: string
}

export interface Job {
  id: number
  title: string
  workspace: string
  status: string
  tone: Tone
  applicants: number
  createdAt: string
}

export interface WsRequest {
  id: number
  businessName: string
  fullAddress: string
  createdAt: string
  status: string
  tone: Tone
  registrationNo: string
  businessType: string
  contact: string
  lat: string
  lng: string
}

export interface WsManage {
  id: number
  name: string
  address: string
  status: string
  tone: Tone
  workers: number
  createdAt: string
}

export interface Report {
  id: number
  targetType: string
  targetName: string
  status: string
  tone: Tone
  createdAt: string
  reason: string
  adminComment: string
  updatedAt: string
}

export interface Terms {
  id: number
  type: string
  version: string
  title: string
  required: string
  status: string
  tone: Tone
  effectiveAt: string
}

export interface Admin {
  email: string
  name: string
  role: string
  roleTone: Tone
  lastLogin: string
  status: string
  tone: Tone
}

export interface RepKeyword {
  emoji: string
  description: string
  count: number
}

export interface RepRow {
  kind: string
  content: string
  counterpart: string
  status: string
  tone: Tone
}

export const members: Member[] = [
  { id: 1, email: 'minjun.kim@gmail.com', name: '김민준', nickname: '민준', role: '일반', roleTone: 'gray', status: '활성', statusTone: 'green', createdAt: '2025-03-12', contact: '010-2345-6789', birthday: '1996-04-21', gender: '남성', updatedAt: '2026-06-10' },
  { id: 2, email: 'seoyeon.lee@gmail.com', name: '이서연', nickname: '서연샵', role: '매니저', roleTone: 'green', status: '활성', statusTone: 'green', createdAt: '2025-01-28', contact: '010-8821-1043', birthday: '1990-11-02', gender: '여성', updatedAt: '2026-06-12' },
  { id: 3, email: 'doyoon.park@naver.com', name: '박도윤', nickname: '도윤', role: '일반', roleTone: 'gray', status: '정지', statusTone: 'red', createdAt: '2024-12-03', contact: '010-5567-7782', birthday: '1998-07-19', gender: '남성', updatedAt: '2026-05-30' },
  { id: 4, email: 'jiwoo.choi@gmail.com', name: '최지우', nickname: '지우지우', role: '매니저', roleTone: 'green', status: '활성', statusTone: 'green', createdAt: '2025-04-22', contact: '010-3311-9087', birthday: '1993-02-14', gender: '여성', updatedAt: '2026-06-15' },
  { id: 5, email: 'admin.jung@alter.co.kr', name: '정하준', nickname: '운영팀', role: '관리자', roleTone: 'blue', status: '활성', statusTone: 'green', createdAt: '2024-09-01', contact: '010-1004-2000', birthday: '1988-05-30', gender: '남성', updatedAt: '2026-06-16' },
  { id: 6, email: 'eunseo.kang@gmail.com', name: '강은서', nickname: '은서', role: '일반', roleTone: 'gray', status: '삭제됨', statusTone: 'gray', createdAt: '2024-08-17', contact: '010-9090-3321', birthday: '2000-09-09', gender: '여성', updatedAt: '2026-04-11' },
  { id: 7, email: 'jihu.yoon@daum.net', name: '윤지후', nickname: '지후', role: '일반', roleTone: 'gray', status: '활성', statusTone: 'green', createdAt: '2025-05-19', contact: '010-7788-1122', birthday: '1995-12-25', gender: '남성', updatedAt: '2026-06-09' },
  { id: 8, email: 'hayoung.lim@gmail.com', name: '임하영', nickname: '하영맘', role: '매니저', roleTone: 'green', status: '정지', statusTone: 'red', createdAt: '2024-11-11', contact: '010-2020-4545', birthday: '1991-03-08', gender: '여성', updatedAt: '2026-06-01' },
  { id: 9, email: 'taeoh.seo@gmail.com', name: '서태오', nickname: '태오', role: '일반', roleTone: 'gray', status: '활성', statusTone: 'green', createdAt: '2025-02-07', contact: '010-6363-8181', birthday: '1997-06-16', gender: '남성', updatedAt: '2026-06-13' },
]

export const repKeywords: RepKeyword[] = [
  { emoji: '⏰', description: '시간 약속을 잘 지켜요', count: 42 },
  { emoji: '😊', description: '친절하고 매너가 좋아요', count: 37 },
  { emoji: '💪', description: '맡은 일을 책임감 있게 해요', count: 28 },
  { emoji: '⚡', description: '일 처리가 빨라요', count: 19 },
  { emoji: '🤝', description: '소통이 원활해요', count: 14 },
]

export const repRows: RepRow[] = [
  { kind: '수신', content: '시간 약속을 잘 지켜요', counterpart: '카페 무브먼트', status: '활성', tone: 'green' },
  { kind: '수신', content: '친절하고 매너가 좋아요', counterpart: '이서연 매니저', status: '활성', tone: 'green' },
  { kind: '작성', content: '근무 환경이 깔끔해요', counterpart: '베이커리 온', status: '비활성', tone: 'gray' },
  { kind: '수신', content: '불친절했어요', counterpart: '익명', status: '삭제됨', tone: 'red' },
]

export const jobs: Job[] = [
  { id: 1, title: '주말 오전 홀서빙 구합니다', workspace: '카페 무브먼트', status: '게시중', tone: 'green', applicants: 14, createdAt: '2026-06-12' },
  { id: 2, title: '평일 야간 주방 보조', workspace: '베이커리 온', status: '검토중', tone: 'amber', applicants: 3, createdAt: '2026-06-14' },
  { id: 3, title: '단기 행사 스태프 (3일)', workspace: '플레이스 강남', status: '게시중', tone: 'green', applicants: 27, createdAt: '2026-06-10' },
  { id: 4, title: '주 5일 매장 관리자', workspace: '마트 데일리', status: '마감', tone: 'gray', applicants: 41, createdAt: '2026-05-28' },
  { id: 5, title: '오픈 알바 (편의점)', workspace: 'GS 역삼점', status: '비활성', tone: 'red', applicants: 0, createdAt: '2026-06-15' },
  { id: 6, title: '주말 베이커리 판매', workspace: '베이커리 온', status: '게시중', tone: 'green', applicants: 9, createdAt: '2026-06-13' },
  { id: 7, title: '브런치 카페 바리스타', workspace: '카페 무브먼트', status: '검토중', tone: 'amber', applicants: 6, createdAt: '2026-06-16' },
  { id: 8, title: '물류 상하차 단기', workspace: '로지스 센터', status: '마감', tone: 'gray', applicants: 33, createdAt: '2026-05-20' },
]

export const wsRequests: WsRequest[] = [
  { id: 1, businessName: '카페 무브먼트 본점', fullAddress: '서울 강남구 테헤란로 123', createdAt: '2026-06-14', status: '승인대기', tone: 'amber', registrationNo: '123-45-67890', businessType: '휴게음식점', contact: '02-555-1234', lat: '37.5012', lng: '127.0396' },
  { id: 2, businessName: '베이커리 온', fullAddress: '서울 마포구 양화로 45', createdAt: '2026-06-13', status: '활성화', tone: 'green', registrationNo: '214-88-12345', businessType: '제과점', contact: '02-333-7788', lat: '37.5563', lng: '126.9220' },
  { id: 3, businessName: '플레이스 강남', fullAddress: '서울 강남구 봉은사로 211', createdAt: '2026-06-12', status: '반려', tone: 'red', registrationNo: '305-12-99887', businessType: '일반음식점', contact: '02-777-0099', lat: '37.5103', lng: '127.0589' },
  { id: 4, businessName: '마트 데일리 역삼', fullAddress: '서울 강남구 역삼로 88', createdAt: '2026-06-11', status: '승인대기', tone: 'amber', registrationNo: '118-22-33445', businessType: '소매업', contact: '02-444-5566', lat: '37.4998', lng: '127.0367' },
  { id: 5, businessName: '로지스 센터 김포', fullAddress: '경기 김포시 통진읍 물류로 7', createdAt: '2026-06-09', status: '활성화', tone: 'green', registrationNo: '402-66-77889', businessType: '물류창고', contact: '031-988-1212', lat: '37.6912', lng: '126.5331' },
  { id: 6, businessName: '브런치하우스 성수', fullAddress: '서울 성동구 연무장길 33', createdAt: '2026-06-08', status: '승인대기', tone: 'amber', registrationNo: '220-31-55667', businessType: '일반음식점', contact: '02-1212-3434', lat: '37.5447', lng: '127.0557' },
]

export const wsManage: WsManage[] = [
  { id: 1, name: '카페 무브먼트 본점', address: '서울 강남구 테헤란로 123', status: '영업중', tone: 'green', workers: 12, createdAt: '2025-08-01' },
  { id: 2, name: '베이커리 온', address: '서울 마포구 양화로 45', status: '영업중', tone: 'green', workers: 7, createdAt: '2025-09-12' },
  { id: 3, name: '마트 데일리 역삼', address: '서울 강남구 역삼로 88', status: '휴업', tone: 'gray', workers: 0, createdAt: '2025-06-20' },
  { id: 4, name: '플레이스 강남', address: '서울 강남구 봉은사로 211', status: '정지', tone: 'red', workers: 4, createdAt: '2025-04-30' },
  { id: 5, name: '로지스 센터 김포', address: '경기 김포시 통진읍 물류로 7', status: '영업중', tone: 'green', workers: 21, createdAt: '2025-03-15' },
]

export const reports: Report[] = [
  { id: 1, targetType: '사용자', targetName: '박도윤', status: '대기중', tone: 'amber', createdAt: '2026-06-16', reason: '근무 약속 후 무단 불참이 반복되었습니다. 연락도 받지 않습니다.', adminComment: '', updatedAt: '2026-06-16' },
  { id: 2, targetType: '평판', targetName: '"불친절했어요" 평판', status: '처리중', tone: 'amber', createdAt: '2026-06-15', reason: '사실과 다른 악의적 평판입니다. 해당 날짜에 근무하지 않았습니다.', adminComment: '신고자 근무 이력 확인 중', updatedAt: '2026-06-16' },
  { id: 3, targetType: '공고', targetName: '오픈 알바 (편의점)', status: '완료', tone: 'green', createdAt: '2026-06-14', reason: '최저임금 미만의 시급을 제시한 부적절 공고입니다.', adminComment: '공고 비활성 처리 완료', updatedAt: '2026-06-15' },
  { id: 4, targetType: '업장', targetName: '플레이스 강남', status: '거부됨', tone: 'red', createdAt: '2026-06-13', reason: '허위 업장 정보로 의심됩니다.', adminComment: '사업자 정보 정상 확인, 반려', updatedAt: '2026-06-14' },
  { id: 5, targetType: '사용자', targetName: '임하영', status: '대기중', tone: 'amber', createdAt: '2026-06-13', reason: '타 근무자에게 폭언을 했다는 제보입니다.', adminComment: '', updatedAt: '2026-06-13' },
  { id: 6, targetType: '공고', targetName: '단기 행사 스태프', status: '완료', tone: 'green', createdAt: '2026-06-11', reason: '중복 게시된 공고입니다.', adminComment: '중복 공고 정리 완료', updatedAt: '2026-06-12' },
]

export const terms: Terms[] = [
  { id: 1, type: '서비스 이용약관', version: 'v2.1', title: 'Alter 서비스 이용약관', required: '필수', status: '게시됨', tone: 'green', effectiveAt: '2026-05-01' },
  { id: 2, type: '개인정보 처리방침', version: 'v1.8', title: '개인정보 수집 및 이용 동의', required: '필수', status: '게시됨', tone: 'green', effectiveAt: '2026-05-01' },
  { id: 3, type: '위치정보', version: 'v1.2', title: '위치기반 서비스 이용약관', required: '필수', status: '게시됨', tone: 'green', effectiveAt: '2025-11-15' },
  { id: 4, type: '마케팅', version: 'v1.0', title: '마케팅 정보 수신 동의', required: '선택', status: '작성중', tone: 'amber', effectiveAt: '-' },
  { id: 5, type: '서비스 이용약관', version: 'v3.0', title: 'Alter 서비스 이용약관 개정안', required: '필수', status: '작성중', tone: 'amber', effectiveAt: '2026-07-01' },
  { id: 6, type: '마케팅', version: 'v0.9', title: '마케팅 수신 동의 (구버전)', required: '선택', status: '폐기됨', tone: 'gray', effectiveAt: '2024-01-01' },
]

export const admins: Admin[] = [
  { email: 'admin@alter.co.kr', name: '정하준', role: '관리자', roleTone: 'blue', lastLogin: '2026-06-16 09:12', status: '활성', tone: 'green' },
  { email: 'ops.kim@alter.co.kr', name: '김운영', role: '매니저', roleTone: 'green', lastLogin: '2026-06-15 18:40', status: '활성', tone: 'green' },
  { email: 'cs.lee@alter.co.kr', name: '이고객', role: '매니저', roleTone: 'green', lastLogin: '2026-06-14 11:05', status: '활성', tone: 'green' },
  { email: 'temp.park@alter.co.kr', name: '박임시', role: '매니저', roleTone: 'green', lastLogin: '2026-05-02 08:33', status: '정지', tone: 'red' },
]

export const ADMIN_EMAIL = 'admin@alter.co.kr'

// ===== 대시보드 차트 =====
export type Metric = 'members' | 'workspaces'
export type Period = 'weekly' | 'monthly' | 'yearly'

export interface Series {
  labels: string[]
  values: number[]
}

export const charts: Record<Metric, Record<Period, Series>> = {
  members: {
    monthly: { labels: ['1월', '2월', '3월', '4월', '5월', '6월'], values: [9200, 9850, 10400, 11200, 11900, 12480] },
    weekly: { labels: ['5월4주', '6월1주', '6월2주', '6월3주'], values: [11900, 12080, 12290, 12480] },
    yearly: { labels: ['2022', '2023', '2024', '2025', '2026'], values: [2100, 4800, 7600, 10900, 12480] },
  },
  workspaces: {
    monthly: { labels: ['1월', '2월', '3월', '4월', '5월', '6월'], values: [980, 1040, 1110, 1190, 1265, 1340] },
    weekly: { labels: ['5월4주', '6월1주', '6월2주', '6월3주'], values: [1265, 1290, 1318, 1340] },
    yearly: { labels: ['2022', '2023', '2024', '2025', '2026'], values: [210, 460, 720, 1080, 1340] },
  },
}

export interface ChartDot {
  x: string
  y: string
  r: number
  label: string
}

export interface ChartGrid {
  y: string
  ty: string
  label: string
}

export interface ChartView {
  linePath: string
  areaPath: string
  dots: ChartDot[]
  grid: ChartGrid[]
  yoy: string
}

export function buildChart(metric: Metric, period: Period): ChartView {
  const series = charts[metric][period]
  const { values, labels } = series
  const W = 760
  const H = 250
  const padTop = 20
  const padBot = 28
  const max = Math.max(...values) * 1.12
  const min = Math.min(...values) * 0.92
  const n = values.length
  const xs = (i: number) => (n === 1 ? W / 2 : (W * i) / (n - 1))
  const ys = (v: number) =>
    padTop + (H - padTop - padBot) * (1 - (v - min) / (max - min))
  const pts = values.map((v, i) => ({ x: xs(i), y: ys(v) }))
  const linePath = pts
    .map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1))
    .join(' ')
  const areaPath =
    linePath +
    ' L ' +
    xs(n - 1).toFixed(1) +
    ' ' +
    (H - padBot) +
    ' L ' +
    xs(0).toFixed(1) +
    ' ' +
    (H - padBot) +
    ' Z'
  const dots: ChartDot[] = pts.map((p, i) => ({
    x: p.x.toFixed(1),
    y: p.y.toFixed(1),
    r: i === n - 1 ? 5 : 3.5,
    label: labels[i],
  }))
  const grid: ChartGrid[] = [0, 1, 2, 3].map(g => {
    const y = padTop + ((H - padTop - padBot) * g) / 3
    const val = Math.round(max - ((max - min) * g) / 3)
    return { y: y.toFixed(1), ty: (y - 4).toFixed(1), label: val.toLocaleString() }
  })
  const yoy = metric === 'members' ? '+14.5%' : '+24.1%'
  return { linePath, areaPath, dots, grid, yoy }
}

export interface PageBtn {
  n: number
  bg: string
  fg: string
  border: string
}

export function pages(total: number, cur: number): PageBtn[] {
  return Array.from({ length: total }, (_, i) => {
    const n = i + 1
    const active = n === cur
    return {
      n,
      bg: active ? '#07c079' : '#fff',
      fg: active ? '#fff' : '#5f5f5f',
      border: active ? '#07c079' : '#e5e5e5',
    }
  })
}
