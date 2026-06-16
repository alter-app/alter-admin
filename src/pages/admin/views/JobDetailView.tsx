import { badge } from '@/shared/admin/data'
import type { Job } from '@/shared/admin/data'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import { Badge } from '@/shared/ui/Badge'
import { BackButton, FieldGrid } from './detailParts'

export function JobDetailView({ job }: { job: Job }) {
  const openConfirm = useAdminStore(s => s.openConfirm)
  const b = badge(job.tone)

  const fields = [
    { label: '지원자 수', value: `${job.applicants}명` },
    { label: '등록일', value: job.createdAt },
    { label: '근무 시급', value: '12,500원' },
    { label: '모집 인원', value: '2명' },
  ]

  const content =
    '주말 오전 시간대 홀서빙 근무자를 모집합니다. 친절하고 성실한 분을 우대하며, 경력자는 시급 협의 가능합니다. 근무 시간은 토·일 09:00~14:00 입니다.'

  return (
    <>
      <BackButton />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 320px',
          gap: 16,
          alignItems: 'start',
        }}
      >
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
              gap: 10,
              marginBottom: 6,
            }}
          >
            <Badge text={job.status} bg={b.bg} fg={b.fg} />
            <span style={{ fontSize: 13, color: '#828282' }}>
              {job.workspace}
            </span>
          </div>
          <h2 style={{ margin: '6px 0 18px', fontSize: 22, fontWeight: 600 }}>
            {job.title}
          </h2>
          <div style={{ marginBottom: 20 }}>
            <FieldGrid fields={fields} />
          </div>
          <div
            style={{
              fontSize: 12,
              color: '#a3a3a3',
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            공고 내용 (강제 수정 가능)
          </div>
          <textarea
            defaultValue={content}
            style={{
              width: '100%',
              minHeight: 140,
              border: '1px solid #c3c3c3',
              borderRadius: 12,
              padding: 14,
              fontSize: 14,
              fontFamily: 'inherit',
              lineHeight: 1.6,
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </section>

        <aside
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 16,
            padding: 22,
            position: 'sticky',
            top: 100,
          }}
        >
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>
            공고 조치
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              onClick={() =>
                openConfirm({
                  title: '공고 수정',
                  desc: '수정한 공고 내용을 저장할까요?',
                  label: '저장',
                  color: '#07c079',
                })
              }
              className="adm-btn-primary"
              style={{
                height: 46,
                border: 'none',
                borderRadius: 12,
                background: '#07c079',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(7,192,121,.3)',
              }}
            >
              수정 내용 저장
            </button>
            <button
              type="button"
              onClick={() =>
                openConfirm({
                  title: '공고 비활성',
                  desc: '해당 공고를 비활성 처리할까요?',
                  label: '비활성',
                  color: '#e8920b',
                })
              }
              className="adm-hover-bright-soft"
              style={{
                height: 46,
                border: '1px solid #f3e2c4',
                borderRadius: 12,
                background: '#fdf3e2',
                color: '#b9740a',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              공고 비활성
            </button>
            <button
              type="button"
              onClick={() =>
                openConfirm({
                  title: '공고 삭제',
                  desc: '부적절 공고를 삭제(제재)할까요?',
                  label: '삭제',
                  color: '#dc0000',
                })
              }
              className="adm-hover-red"
              style={{
                height: 46,
                border: '1px solid #f3caca',
                borderRadius: 12,
                background: '#fff',
                color: '#dc0000',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              공고 삭제 (제재)
            </button>
          </div>
        </aside>
      </div>
    </>
  )
}
