import type { Tone } from './data'

export interface DescribedEnum {
  value: string
  description: string
}

// value → Tone mapping tables
const USER_STATUS: Record<string, Tone> = {
  ACTIVE: 'green',
  SUSPENDED: 'red',
  DELETED: 'gray',
}

const USER_ROLE: Record<string, Tone> = {
  ROLE_USER: 'gray',
  ROLE_MANAGER: 'green',
  ROLE_ADMIN: 'blue',
}

const REPORT_STATUS: Record<string, Tone> = {
  PENDING: 'amber',
  PROCESSING: 'blue',
  RESOLVED: 'green',
  REJECTED: 'red',
  CANCELLED: 'gray',
  DELETED: 'gray',
}

const WS_REQUEST_STATUS: Record<string, Tone> = {
  PENDING: 'amber',
  ACTIVATED: 'green',
  REVOKED: 'red',
  CANCELLED: 'gray',
}

const TERMS_STATUS: Record<string, Tone> = {
  DRAFT: 'amber',
  PUBLISHED: 'green',
  DEPRECATED: 'gray',
  DELETED: 'gray',
}

export function userStatusTone(value: string): Tone {
  return USER_STATUS[value] ?? 'gray'
}

export function userRoleTone(value: string): Tone {
  return USER_ROLE[value] ?? 'gray'
}

export function reportStatusTone(value: string): Tone {
  return REPORT_STATUS[value] ?? 'gray'
}

export function wsRequestStatusTone(value: string): Tone {
  return WS_REQUEST_STATUS[value] ?? 'gray'
}

export function termsStatusTone(value: string): Tone {
  return TERMS_STATUS[value] ?? 'gray'
}
