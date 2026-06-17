export interface CommonApiResponse<T> {
  timestamp: string
  data: T
}

export interface OffsetPage {
  page: number
  pageSize: number
  totalCount: number
  totalPage: number
}

export interface CursorPage {
  cursor: string | null
  pageSize: number
  totalCount: number
}

export interface OffsetPagedData<T> {
  page: OffsetPage
  data: T[]
}

export interface CursorPagedData<T> {
  page: CursorPage
  data: T[]
}

export interface ErrorResponse {
  code?: string
  message?: string
}

export interface ApiError {
  data?: ErrorResponse
  message?: string
}
