import { badge } from '@/shared/admin/data'
import type { WsRequest } from '@/shared/admin/data'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import { Badge } from '@/shared/ui/Badge'
import { BackButton, FieldGrid } from './detailParts'

const FILES = [
  { name: '사업자등록증명원', meta: 'PDF · 1.2MB', bg: '#f4f4f4' },
  { name: '대표자 신분증', meta: 'JPG · 0.8MB', bg: '#eef6f2' },
  { name: '위임확인서', meta: 'PDF · 0.5MB', bg: '#f4f4f4' },
]

const THREAD = [
  { author: '정하준', at: '06-15 14:02', text: '사업자등록번호 국세청 조회 정상 확인.' },
  { author: '김운영', at: '06-15 10:31', text: '신분증 사진 흐림, 재확인 필요.' },
]

export function WsRequestDetailView({ request }: { request: WsRequest }) {
  const openConfirm = useAdminStore(s => s.openConfirm)
  const openRejectModal = useAdminStore(s => s.openRejectModal)
  const b = badge(request.tone)

  const fields = [
    { label: '사업자등록번호', value: request.registrationNo },
    { label: '업종', value: request.businessType },
    { label: '대표 연락처', value: request.contact },
    { label: '주소', value: request.fullAddress },
    { label: '좌표 (위도)', value: request.lat },
    { label: '좌표 (경도)', value: request.lng },
  ]

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
                marginBottom: 20,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                {request.businessName}
              </h2>
              <Badge text={request.status} bg={b.bg} fg={b.fg} />
            </div>
            <FieldGrid fields={fields} />
          </section>

          <section
            style={{
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: 16,
              padding: 24,
            }}
          >
            <h2 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600 }}>
              증빙 서류
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: 12,
              }}
            >
              {FILES.map(file => (
                <div
                  key={file.name}
                  style={{
                    border: '1px solid #e5e5e5',
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: 128,
                      background: file.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#828282',
                    }}
                  >
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#a3a3a3"
                      strokeWidth="1.6"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                    </svg>
                  </div>
                  <div
                    style={{
                      padding: '10px 12px',
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#232323',
                      }}
                    >
                      {file.name}
                    </div>
                    <div
                      style={{ fontSize: 12, color: '#a3a3a3', marginTop: 2 }}
                    >
                      {file.meta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

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
            심사 조치
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginBottom: 18,
            }}
          >
            <button
              type="button"
              onClick={() =>
                openConfirm({
                  title: '업장 승인',
                  desc: '해당 업장 등록 신청을 승인할까요?',
                  label: '승인',
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
              승인
            </button>
            <button
              type="button"
              onClick={openRejectModal}
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
              반려 사유 등록
            </button>
          </div>
          <div style={{ height: 1, background: '#f0f0f0', marginBottom: 16 }} />
          <div
            style={{
              fontSize: 12,
              color: '#a3a3a3',
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            심사 메모
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {THREAD.map((t, i) => (
              <div
                key={i}
                style={{
                  background: '#f4f4f4',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: '#a3a3a3',
                    marginBottom: 5,
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#5f5f5f' }}>
                    {t.author}
                  </span>
                  <span>{t.at}</span>
                </div>
                <div style={{ fontSize: 13, color: '#232323' }}>{t.text}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}
