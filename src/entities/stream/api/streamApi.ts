import { httpClient } from '@/shared'
import {
  toCategoryCode,
  toCategoryLabel,
  type LiveStreamRankItemDto,
  type LiveStreamSummaryDto,
  type PageResponse,
  type Stream,
  type StreamCategoryLabel,
} from '../model/streamTypes'

function toStream(dto: LiveStreamSummaryDto, viewerCount: number): Stream {
  return {
    id: dto.id,
    streamerId: dto.streamerId,
    title: dto.title,
    category: toCategoryLabel(dto.category),
    viewerCount,
    status: dto.status,
  }
}

/** [최신순] GET /streams — 키셋 페이징. 첫 페이지는 아주 과거 시각으로 조회. */
export async function fetchStreamsLatest(params: {
  category: StreamCategoryLabel
  query?: string
  lastCreatedAt?: string
  size?: number
}): Promise<Stream[]> {
  const { data } = await httpClient.get<PageResponse<LiveStreamSummaryDto>>('/streams', {
    params: {
      category: toCategoryCode(params.category),
      query: params.query || undefined,
      lastCreatedAt: params.lastCreatedAt ?? '2000-01-01T00:00:00Z',
      size: params.size ?? 20,
    },
  })
  // 최신순 응답엔 실시간 시청자 수가 없으므로 maxViewerCount 로 대체 표시
  return data.content.map((dto) => toStream(dto, dto.maxViewerCount ?? 0))
}

/** [시청자순] GET /streams/live — Redis 랭킹 + offset 페이징. */
export async function fetchStreamsByViewer(params: {
  category: StreamCategoryLabel
  query?: string
  offset?: number
  size?: number
}): Promise<Stream[]> {
  const { data } = await httpClient.get<PageResponse<LiveStreamRankItemDto>>('/streams/live', {
    params: {
      category: toCategoryCode(params.category),
      query: params.query || undefined,
      offset: params.offset ?? 0,
      size: params.size ?? 20,
    },
  })
  return data.content.map((item) => toStream(item.stream, item.currentViewerCount))
}