import { Badge } from '@/shared/ui/Badge'
import type { Cell, Filter, ListConfig } from '../lists'

function FilterControl({ filter }: { filter: Filter }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#828282' }}>
        {filter.label}
      </span>
      {filter.kind === 'select' ? (
        <select
          style={{
            height: 42,
            minWidth: 148,
            padding: '0 12px',
            border: '1px solid #c3c3c3',
            borderRadius: 12,
            background: '#fff',
            fontSize: 14,
            color: '#232323',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          {filter.options.map(o => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder={filter.placeholder}
          style={{
            height: 42,
            width: 240,
            padding: '0 14px',
            border: '1px solid #c3c3c3',
            borderRadius: 12,
            fontSize: 14,
            outline: 'none',
          }}
        />
      )}
    </label>
  )
}

function CellContent({ cell }: { cell: Cell }) {
  if (cell.kind === 'badge') {
    return <Badge text={cell.text} bg={cell.bg} fg={cell.fg} />
  }
  return <>{cell.text}</>
}

interface ListViewProps {
  config: ListConfig
  currentPage?: number
  totalPage?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
}

export function ListView({ config, currentPage = 1, totalPage, onPageChange, isLoading }: ListViewProps) {
  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>
            {config.title}
          </h1>
          {config.isMock && (
            <span style={{ fontSize: 12, fontWeight: 600, color: '#828282', background: '#efefef', borderRadius: 6, padding: '3px 8px' }}>
              미연동 · 예시
            </span>
          )}
        </div>
        {config.hasPrimary && (
          <button
            type="button"
            onClick={config.onPrimary}
            className="adm-btn-primary"
            style={{
              height: 44,
              padding: '0 18px',
              border: 'none',
              borderRadius: 12,
              background: '#07c079',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(7,192,121,.3)',
              transition: 'all .2s ease',
            }}
          >
            {config.primaryLabel}
          </button>
        )}
      </div>

      {config.tabs && (
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginBottom: 16,
            borderBottom: '1px solid #e5e5e5',
          }}
        >
          {config.tabs.map(t => (
            <button
              key={t.label}
              type="button"
              onClick={t.on}
              style={{
                height: 42,
                padding: '0 18px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 600,
                color: t.fg,
                borderBottom: `2px solid ${t.bar}`,
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {config.filters.map(f => (
          <FilterControl key={f.label} filter={f} />
        ))}
        <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
          <button
            type="button"
            className="adm-hover-f4"
            style={{
              height: 42,
              padding: '0 16px',
              border: '1px solid #c3c3c3',
              borderRadius: 12,
              background: '#fff',
              color: '#5f5f5f',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            초기화
          </button>
          <button
            type="button"
            className="adm-hover-bright"
            style={{
              height: 42,
              padding: '0 22px',
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
            조회
          </button>
        </div>
      </div>

      <div
        style={{
          background: '#fff',
          border: '1px solid #e5e5e5',
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
        >
          <thead>
            <tr style={{ background: '#efefef' }}>
              {config.columns.map(col => (
                <th
                  key={col.label}
                  style={{
                    padding: '14px 18px',
                    textAlign: col.align,
                    width: col.width,
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#5f5f5f',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={config.columns.length} style={{ padding: 40, textAlign: 'center', color: '#a3a3a3', fontSize: 14 }}>
                  불러오는 중...
                </td>
              </tr>
            )}
            {!isLoading && config.rows.length === 0 && (
              <tr>
                <td colSpan={config.columns.length} style={{ padding: 40, textAlign: 'center', color: '#a3a3a3', fontSize: 14 }}>
                  데이터가 없습니다
                </td>
              </tr>
            )}
            {!isLoading && config.rows.map((row, ri) => (
              <tr
                key={ri}
                onClick={row.onOpen}
                className="adm-row"
                style={{
                  borderTop: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background .12s ease',
                }}
              >
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: '15px 18px',
                      textAlign: cell.align,
                      fontSize: 14,
                      color: cell.kind === 'text' ? cell.color : undefined,
                      fontWeight: cell.kind === 'text' ? cell.weight : undefined,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <CellContent cell={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 6,
          marginTop: 22,
        }}
      >
        <button
          type="button"
          onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          style={{
            width: 38,
            height: 38,
            border: '1px solid #e5e5e5',
            borderRadius: 10,
            background: '#fff',
            color: '#a3a3a3',
            cursor: currentPage <= 1 ? 'default' : 'pointer',
            opacity: currentPage <= 1 ? 0.4 : 1,
          }}
        >
          ‹
        </button>
        {config.pages.map(p => (
          <button
            key={p.n}
            type="button"
            onClick={() => onPageChange?.(p.n)}
            style={{
              minWidth: 38,
              height: 38,
              padding: '0 6px',
              border: `1px solid ${p.border}`,
              borderRadius: 10,
              background: p.bg,
              color: p.fg,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {p.n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange?.(Math.min(totalPage ?? currentPage, currentPage + 1))}
          disabled={!totalPage || currentPage >= totalPage}
          style={{
            width: 38,
            height: 38,
            border: '1px solid #e5e5e5',
            borderRadius: 10,
            background: '#fff',
            color: '#5f5f5f',
            cursor: (!totalPage || currentPage >= totalPage) ? 'default' : 'pointer',
            opacity: (!totalPage || currentPage >= totalPage) ? 0.4 : 1,
          }}
        >
          ›
        </button>
      </div>
    </>
  )
}
