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

// ----- 방송 생성/시작/종료/상세 (라이프사이클) -----
import {
  type CreateStreamRequest,
  type StreamDetail,
  type StreamDetailDto,
} from '../model/streamTypes'

function toStreamDetail(dto: StreamDetailDto): StreamDetail {
  return {
    id: dto.id,
    streamerId: dto.streamerId,
    title: dto.title,
    category: toCategoryLabel(dto.category),
    status: dto.status,
    startedAt: dto.startedAt,
  }
}

/**
 * 방송 개설 POST /streams (READY 생성). category 는 한글 라벨로 받아 enum 코드로 변환.
 * 개설자(streamerId)는 서버가 JWT 에서 식별하므로 보내지 않는다.
 */
export async function createStream(params: {
  title: string
  category: Exclude<StreamCategoryLabel, '전체'>
}): Promise<StreamDetail> {
  const code = toCategoryCode(params.category)
  const payload: CreateStreamRequest = {
    title: params.title,
    category: code!, // '전체' 제외 라벨이므로 code 항상 존재
  }
  const { data } = await httpClient.post<StreamDetailDto>('/streams', payload)
  return toStreamDetail(data)
}

/** 방송 시작 POST /streams/{id}/start (READY -> LIVE). 방송 주인만 가능. */
export async function startStream(streamId: string): Promise<StreamDetail> {
  const { data } = await httpClient.post<StreamDetailDto>(`/streams/${streamId}/start`, {})
  return toStreamDetail(data)
}

/** 방송 종료 POST /streams/{id}/end (LIVE -> ENDED). 방송 주인만 가능. */
export async function endStream(streamId: string): Promise<StreamDetail> {
  const { data } = await httpClient.post<StreamDetailDto>(`/streams/${streamId}/end`)
  return toStreamDetail(data)
}

/** 단건 상세 GET /streams/{id}. */
export async function fetchStreamDetail(streamId: string): Promise<StreamDetail> {
  const { data } = await httpClient.get<StreamDetailDto>(`/streams/${streamId}`)
  return toStreamDetail(data)
}

export interface UploadVideoResult {
  videoId: number
  videoUrl: string
}

/** 동영상 업로드 POST /videos/upload — multipart/form-data */
export async function uploadVideo(
  file: File,
  title?: string,
  onProgress?: (percent: number) => void,
): Promise<UploadVideoResult> {
  const form = new FormData()
  form.append('file', file)
  if (title) form.append('title', title)

  const { data } = await httpClient.post<UploadVideoResult>('/videos/upload', form, {
    timeout: 0, // 파일 크기에 따라 시간이 가변적이므로 타임아웃 해제
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    },
  })
  return data
}