import { useAdminStore } from '@/shared/stores/useAdminStore'

export function BackButton() {
  const back = useAdminStore(s => s.back)
  return (
    <button
      type="button"
      onClick={back}
      className="adm-back"
      style={{
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: '#828282',
        fontSize: 14,
        marginBottom: 14,
      }}
    >
      ‹ 목록으로
    </button>
  )
}

export function FieldGrid({
  fields,
}: {
  fields: { label: string; value: string }[]
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 1,
        background: '#f0f0f0',
        border: '1px solid #f0f0f0',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      {fields.map(f => (
        <div key={f.label} style={{ background: '#fff', padding: '14px 16px' }}>
          <div style={{ fontSize: 12, color: '#a3a3a3', fontWeight: 600 }}>
            {f.label}
          </div>
          <div style={{ fontSize: 14, color: '#232323', marginTop: 5 }}>
            {f.value}
          </div>
        </div>
      ))}
    </div>
  )
}
