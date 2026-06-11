// 백엔드 enum 과 1:1. (StreamCategory.java)
export type StreamCategoryCode =
  | 'GAMING' | 'MUKBANG' | 'TALK' | 'MUSIC' | 'STUDY' | 'SPORTS' | 'CREATIVE'

export type StreamStatusCode = 'READY' | 'LIVE' | 'ENDED'

// 화면 표시용 한글 라벨 ('전체'는 필터 전용, 백엔드 코드 없음)
export type StreamCategoryLabel =
  | '전체' | '게임' | '먹방' | '소통' | '음악' | '공부' | '스포츠' | '창작'

export const CATEGORY_LABELS: StreamCategoryLabel[] = [
  '전체', '게임', '먹방', '소통', '음악', '공부', '스포츠', '창작',
]

// 라벨 <-> 코드 매핑
const LABEL_TO_CODE: Record<Exclude<StreamCategoryLabel, '전체'>, StreamCategoryCode> = {
  게임: 'GAMING',
  먹방: 'MUKBANG',
  소통: 'TALK',
  음악: 'MUSIC',
  공부: 'STUDY',
  스포츠: 'SPORTS',
  창작: 'CREATIVE',
}

const CODE_TO_LABEL: Record<StreamCategoryCode, Exclude<StreamCategoryLabel, '전체'>> = {
  GAMING: '게임',
  MUKBANG: '먹방',
  TALK: '소통',
  MUSIC: '음악',
  STUDY: '공부',
  SPORTS: '스포츠',
  CREATIVE: '창작',
}

/** 한글 라벨 -> 백엔드 코드. '전체'(필터 미적용)는 undefined. */
export function toCategoryCode(label: StreamCategoryLabel): StreamCategoryCode | undefined {
  return label === '전체' ? undefined : LABEL_TO_CODE[label]
}

/** 백엔드 코드 -> 한글 라벨. */
export function toCategoryLabel(code: StreamCategoryCode | null): Exclude<StreamCategoryLabel, '전체'> | null {
  return code ? CODE_TO_LABEL[code] : null
}

// 정렬 모드: 최신순(키셋) / 시청자순(Redis 랭킹)
export type StreamSort = 'latest' | 'viewer'

// ----- 백엔드 응답 (있는 필드만) -----

// GET /streams (최신순) item — LiveStreamSummary
export interface LiveStreamSummaryDto {
  id: string
  streamerId: string
  title: string
  category: StreamCategoryCode | null
  maxViewerCount: number | null
  status: StreamStatusCode
  startedAt: string | null
  createdAt: string | null
}

// GET /streams/live (시청자순) item — LiveStreamRankItem
export interface LiveStreamRankItemDto {
  stream: LiveStreamSummaryDto
  currentViewerCount: number
}

// Spring Page 응답 (필요한 부분만)
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  number: number
  size: number
}

// ----- 프론트 표시 모델 (있는 필드만, 단순화) -----
export interface Stream {
  id: string
  streamerId: string
  title: string
  category: Exclude<StreamCategoryLabel, '전체'> | null
  viewerCount: number
  status: StreamStatusCode
}

// GET /streams/{id} 단건 상세 (StreamDetail)
export interface StreamDetailDto {
  id: string
  streamerId: string
  title: string
  category: StreamCategoryCode | null
  status: StreamStatusCode
  startedAt: string | null
}

// POST /streams 요청 (OpenStreamRequest)
export interface CreateStreamRequest {
  streamerId: string
  title: string
  category: StreamCategoryCode
}

// 프론트 상세 모델
export interface StreamDetail {
  id: string
  streamerId: string
  title: string
  category: Exclude<StreamCategoryLabel, '전체'> | null
  status: StreamStatusCode
  startedAt: string | null
}