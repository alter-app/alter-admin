import { badge } from '@/shared/admin/data'
import type { WsManage } from '@/shared/admin/data'
import { Badge } from '@/shared/ui/Badge'
import { BackButton } from './detailParts'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

interface Shift {
  label: string
  bg: string
  fg: string
}

interface Day {
  date: number | ''
  bg: string
  dateColor: string
  shifts: Shift[]
}

function buildDays(): Day[] {
  const days: Day[] = []
  for (let i = 0; i < 35; i++) {
    const dateNum = i + 1
    const inMonth = dateNum >= 1 && dateNum <= 30
    const dow = i % 7
    const shifts: Shift[] = []
    if (inMonth && dateNum % 4 === 1)
      shifts.push({ label: '오픈 김민준', bg: '#e6f9f2', fg: '#0f7745' })
    if (inMonth && dateNum % 5 === 2)
      shifts.push({ label: '마감 이서연', bg: '#e9eefc', fg: '#003BDC' })
    if (inMonth && dateNum % 7 === 3)
      shifts.push({ label: '미배정', bg: '#fdf3e2', fg: '#b9740a' })
    days.push({
      date: inMonth ? dateNum : '',
      bg: inMonth ? '#fff' : '#fafafa',
      dateColor: dow === 0 ? '#dc0000' : dow === 6 ? '#003BDC' : '#828282',
      shifts,
    })
  }
  return days
}

export function WsManageDetailView({ workspace }: { workspace: WsManage }) {
  const b = badge(workspace.tone)
  const days = buildDays()

  return (
    <>
      <BackButton />
      <section
        style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 16,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            {workspace.name}
          </h2>
          <Badge text={workspace.status} bg={b.bg} fg={b.fg} />
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: '#828282' }}>
          {workspace.address}
        </p>
      </section>

      <section
        style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 16,
          padding: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            스케줄 관리{' '}
            <span style={{ fontSize: 12, color: '#a3a3a3', fontWeight: 400 }}>
              예시 데이터
            </span>
          </h2>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#5f5f5f' }}>
            2026년 6월
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7,1fr)',
            gap: 6,
          }}
        >
          {WEEKDAYS.map(d => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: '#a3a3a3',
                paddingBottom: 4,
              }}
            >
              {d}
            </div>
          ))}
          {days.map((day, i) => (
            <div
              key={i}
              style={{
                minHeight: 84,
                border: '1px solid #f0f0f0',
                borderRadius: 10,
                padding: 7,
                background: day.bg,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: day.dateColor,
                  fontWeight: 600,
                }}
              >
                {day.date}
              </div>
              {day.shifts.map((s, si) => (
                <div
                  key={si}
                  style={{
                    marginTop: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    background: s.bg,
                    color: s.fg,
                    borderRadius: 6,
                    padding: '3px 5px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
