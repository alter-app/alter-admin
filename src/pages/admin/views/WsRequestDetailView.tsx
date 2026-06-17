import { useState } from 'react'
import { badge } from '@/shared/admin/data'
import type { WsRequest } from '@/shared/admin/data'
import { wsRequestStatusTone } from '@/shared/admin/enums'
import {
  useCreateWorkspaceComment,
  useUpdateWorkspaceRequestStatus,
  useWorkspaceComments,
  useWorkspaceRequest,
} from '@/features/workspace-requests/hooks/useWorkspaceRequests'
import { useAdminStore } from '@/shared/stores/useAdminStore'
import { Badge } from '@/shared/ui/Badge'
import { BackButton, FieldGrid } from './detailParts'

function formatDateTime(iso: string) {
  return iso.slice(0, 16).replace('T', ' ')
}

export function WsRequestDetailView({ request }: { request: WsRequest }) {
  const openConfirm = useAdminStore(s => s.openConfirm)
  const openRejectModal = useAdminStore(s => s.openRejectModal)
  const back = useAdminStore(s => s.back)

  const { data: detail } = useWorkspaceRequest(request.id)
  const {
    data: comments,
    isLoading: commentsLoading,
    isError: commentsError,
    refetch,
  } = useWorkspaceComments(request.id)
  const updateStatus = useUpdateWorkspaceRequestStatus(request.id)
  const createComment = useCreateWorkspaceComment(request.id)

  const [actionMenuOpen, setActionMenuOpen] = useState(false)
  const [commentText, setCommentText] = useState('')

  const businessName = detail?.businessName ?? request.businessName
  const statusLabel = detail?.status.description ?? request.status
  const statusValue = detail?.status.value
  const statusTone = detail ? wsRequestStatusTone(statusValue!) : request.tone
  const b = badge(statusTone)

  const canApprove = statusValue === 'PENDING' || statusValue === 'REVOKED'
  const canReject = statusValue === 'PENDING'
  const approveLabel = statusValue === 'REVOKED' ? '승인으로 전환' : '승인'
  const reviewNote =
    statusValue === 'REVOKED'
      ? '이미 반려된 신청입니다. 추가 안내는 아래 대화 입력창에서 보낼 수 있어요.'
      : statusValue === 'ACTIVATED'
        ? '승인 완료된 신청입니다. 변경이 필요하면 아래 대화로 안내하세요.'
        : null

  const fields = [
    {
      label: '사업자등록번호',
      value: detail?.businessRegistrationNo ?? request.registrationNo,
    },
    { label: '업종', value: detail?.businessType ?? request.businessType },
    { label: '대표 연락처', value: detail?.contact ?? request.contact },
    { label: '주소', value: detail?.fullAddress ?? request.fullAddress },
    { label: '좌표 (위도)', value: String(detail?.latitude ?? request.lat) },
    { label: '좌표 (경도)', value: String(detail?.longitude ?? request.lng) },
  ]

  const fileMetas = [
    { name: '사업자등록증명원', fileId: detail?.workspaceCertFileId },
    { name: '대표자 신분증', fileId: detail?.workspaceOwnIdentityFileId },
    { name: '위임확인서', fileId: detail?.workspaceWarrantFileId },
  ]

  const sortedComments = [...(comments ?? [])].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt)
  )
  const threadEmpty =
    !commentsLoading && !commentsError && sortedComments.length === 0
  const threadReady =
    !commentsLoading && !commentsError && sortedComments.length > 0

  function handleApprove() {
    setActionMenuOpen(false)
    const revoked = statusValue === 'REVOKED'
    openConfirm({
      title: revoked ? '승인으로 전환' : '업장 승인',
      desc: revoked
        ? '반려된 신청을 승인(활성화) 상태로 전환할까요?'
        : '해당 업장 등록 신청을 승인할까요?',
      label: '승인',
      color: '#07c079',
      onConfirm: () =>
        updateStatus.mutate(
          { status: 'ACTIVATED' },
          { onSuccess: () => back() }
        ),
    })
  }

  function handleReject() {
    setActionMenuOpen(false)
    openRejectModal({ workspaceRequestId: request.id })
  }

  function handleSend() {
    const comment = commentText.trim()
    if (!comment) return
    createComment.mutate({ comment }, { onSuccess: () => setCommentText('') })
  }

  return (
    <>
      <BackButton />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          maxWidth: 880,
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
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                {businessName}
              </h2>
              <Badge text={statusLabel} bg={b.bg} fg={b.fg} />
            </div>

            <div style={{ position: 'relative', flex: '0 0 auto' }}>
              <button
                type="button"
                onClick={() => setActionMenuOpen(o => !o)}
                className="adm-hover-bright"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  height: 42,
                  padding: '0 16px',
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
                심사 조치<span style={{ fontSize: 11, opacity: 0.85 }}>▾</span>
              </button>

              {actionMenuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="닫기"
                    onClick={() => setActionMenuOpen(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 25,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'default',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 50,
                      width: 252,
                      background: '#fff',
                      border: '1px solid #e5e5e5',
                      borderRadius: 16,
                      boxShadow: '0 12px 32px rgba(0,0,0,.14)',
                      padding: 8,
                      zIndex: 30,
                      animation: 'ddIn .14s ease',
                    }}
                  >
                    {(canApprove || canReject) && (
                      <div
                        style={{
                          padding: '8px 12px 6px',
                          fontSize: 11,
                          fontWeight: 600,
                          color: '#a3a3a3',
                        }}
                      >
                        상태 변경
                      </div>
                    )}
                    {canApprove && (
                      <button
                        type="button"
                        onClick={handleApprove}
                        className="adm-hover-f4"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 9,
                          width: '100%',
                          height: 42,
                          padding: '0 12px',
                          border: 'none',
                          background: 'none',
                          borderRadius: 10,
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#0f7745',
                          textAlign: 'left',
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#e6f9f2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                          }}
                        >
                          ✓
                        </span>
                        {approveLabel}
                      </button>
                    )}
                    {canReject && (
                      <button
                        type="button"
                        onClick={handleReject}
                        className="adm-hover-red"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 9,
                          width: '100%',
                          height: 42,
                          padding: '0 12px',
                          border: 'none',
                          background: 'none',
                          borderRadius: 10,
                          cursor: 'pointer',
                          fontSize: 14,
                          fontWeight: 600,
                          color: '#dc0000',
                          textAlign: 'left',
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#fdeaea',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 11,
                          }}
                        >
                          ✕
                        </span>
                        반려
                      </button>
                    )}
                    {reviewNote && (
                      <div
                        style={{
                          marginTop: canApprove || canReject ? 4 : 0,
                          padding: '10px 12px',
                          background: '#f4f4f4',
                          borderRadius: 10,
                          fontSize: 12,
                          lineHeight: 1.5,
                          color: '#5f5f5f',
                        }}
                      >
                        {reviewNote}
                      </div>
                    )}
                    {!canApprove && !canReject && !reviewNote && (
                      <div
                        style={{
                          padding: '10px 12px',
                          fontSize: 13,
                          color: '#a3a3a3',
                        }}
                      >
                        변경 가능한 작업이 없습니다.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
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
            {fileMetas.map(file => (
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
                    background: '#f4f4f4',
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
                    style={{ fontSize: 13, fontWeight: 600, color: '#232323' }}
                  >
                    {file.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#a3a3a3', marginTop: 2 }}>
                    {file.fileId ? `ID: ${file.fileId.slice(0, 8)}…` : '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          style={{
            background: '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div style={{ marginBottom: 18 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
              신청자와의 대화
            </h2>
            <p style={{ margin: '5px 0 0', fontSize: 13, color: '#828282' }}>
              반려 사유·자료 요청·보강 자료를 이 스레드에서 주고받습니다.
            </p>
          </div>

          <div
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: 14,
              background: '#fcfcfc',
              padding: 18,
              marginBottom: 14,
            }}
          >
            {commentsLoading && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  padding: '44px 0',
                  color: '#a3a3a3',
                }}
              >
                <span
                  style={{
                    width: 26,
                    height: 26,
                    border: '3px solid #e5e5e5',
                    borderTopColor: '#07c079',
                    borderRadius: '50%',
                    animation: 'spin .8s linear infinite',
                  }}
                />
                <span style={{ fontSize: 13 }}>대화를 불러오는 중…</span>
              </div>
            )}

            {commentsError && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  padding: '38px 0',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#fdeaea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#dc0000"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                  >
                    <line x1="12" y1="8" x2="12" y2="13" />
                    <line x1="12" y1="16.6" x2="12" y2="16.6" />
                  </svg>
                </span>
                <div style={{ fontSize: 14, color: '#5f5f5f' }}>
                  대화를 불러오지 못했습니다.
                </div>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="adm-hover-f4"
                  style={{
                    height: 38,
                    padding: '0 18px',
                    border: '1px solid #c3c3c3',
                    borderRadius: 10,
                    background: '#fff',
                    color: '#5f5f5f',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  다시 시도
                </button>
              </div>
            )}

            {threadEmpty && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  padding: '38px 20px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#c3c3c3"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: '#5f5f5f' }}
                >
                  아직 주고받은 대화가 없습니다
                </div>
                <div
                  style={{ fontSize: 13, color: '#a3a3a3', lineHeight: 1.55 }}
                >
                  자료가 더 필요하면 아래에서 먼저 신청자에게 안내를 보낼 수
                  있어요.
                </div>
              </div>
            )}

            {threadReady && (
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
              >
                {sortedComments.map(c => {
                  const admin = c.commentOwner === 'ADMIN'
                  return (
                    <div
                      key={c.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: admin ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: admin ? '#0f7745' : '#5f5f5f',
                          marginBottom: 5,
                        }}
                      >
                        {admin ? '운영자' : '신청자'}
                      </span>
                      <div
                        style={{
                          maxWidth: '74%',
                          minWidth: 0,
                          background: admin ? '#e6f9f2' : '#f4f4f4',
                          border: `1px solid ${admin ? '#c2eddc' : '#ececec'}`,
                          borderRadius: admin
                            ? '16px 16px 4px 16px'
                            : '16px 16px 16px 4px',
                          padding: '12px 14px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 14,
                            lineHeight: 1.55,
                            color: admin ? '#0f4f33' : '#232323',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {c.comment}
                        </div>
                        {c.files.length > 0 && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 8,
                              marginTop: 10,
                            }}
                          >
                            {c.files.map(file => (
                              <a
                                key={file.fileId}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 9,
                                  padding: '9px 11px',
                                  border: `1px solid ${admin ? '#c2eddc' : '#e0e0e0'}`,
                                  background: '#fff',
                                  borderRadius: 10,
                                  textDecoration: 'none',
                                }}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={admin ? '#0f7745' : '#5f5f5f'}
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ flex: '0 0 auto' }}
                                >
                                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                </svg>
                                <span
                                  style={{
                                    flex: 1,
                                    minWidth: 0,
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: admin ? '#0f7745' : '#5f5f5f',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  첨부파일
                                </span>
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#a3a3a3"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  style={{ flex: '0 0 auto' }}
                                >
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="7 10 12 15 17 10" />
                                  <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <span
                        style={{ fontSize: 11, color: '#b5b5b5', marginTop: 6 }}
                      >
                        {formatDateTime(c.createdAt)}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div
            style={{
              border: '1px solid #e5e5e5',
              borderRadius: 14,
              padding: 12,
            }}
          >
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              maxLength={255}
              placeholder="신청자에게 보낼 안내·자료 요청을 입력하세요"
              style={{
                width: '100%',
                minHeight: 60,
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: 14,
                lineHeight: 1.55,
                color: '#232323',
                background: 'transparent',
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 12,
                marginTop: 8,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  color: commentText.length >= 255 ? '#dc0000' : '#a3a3a3',
                }}
              >
                {commentText.length}/255
              </span>
              <button
                type="button"
                onClick={handleSend}
                disabled={!commentText.trim() || createComment.isPending}
                className="adm-hover-bright"
                style={{
                  height: 36,
                  padding: '0 20px',
                  border: 'none',
                  borderRadius: 10,
                  background: '#07c079',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(7,192,121,.3)',
                }}
              >
                {createComment.isPending ? '전송 중...' : '전송'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
