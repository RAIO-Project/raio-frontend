import { create } from 'zustand'

export type StreamCategory = '전체' | '게임' | '먹방' | '소통' | '음악' | '공부' | '스포츠' | '창작'

export interface Stream {
  id: number
  streamerId: string
  streamerName: string
  title: string
  category: Exclude<StreamCategory, '전체'>
  tags: string[]
  viewerCount: number
  followers: number
  emoji: string
  notice: string
}

interface StreamState {
  streams: Stream[]
  category: StreamCategory
  query: string
  setCategory: (category: StreamCategory) => void
  setQuery: (query: string) => void
}

export const CATEGORIES: StreamCategory[] = ['전체', '게임', '먹방', '소통', '음악', '공부', '스포츠', '창작']

export const MOCK_STREAMS: Stream[] = [
  { id: 1, streamerId: 'u101', streamerName: '우주대스타', title: '[무패] 다이아 도전 600판째 오늘은 간다 🏆', category: '게임', tags: ['롤', '랭크'], viewerCount: 24312, followers: 128400, emoji: '🎮', notice: '후원 미션: 1,000P마다 랭크 1판 추가' },
  { id: 2, streamerId: 'u102', streamerName: '먹짱이', title: '편의점 신상 털기 300개 도전 🔥', category: '먹방', tags: ['야식', '리뷰'], viewerCount: 8100, followers: 54200, emoji: '🍜', notice: '매운맛 룰렛 진행 중' },
  { id: 3, streamerId: 'u103', streamerName: '새벽감성', title: '밤샘 잡담방 ㅎㅎ 취침 전 들어와요', category: '소통', tags: ['라디오'], viewerCount: 5700, followers: 30110, emoji: '💬', notice: '사연은 채팅으로 남겨주세요' },
  { id: 4, streamerId: 'u104', streamerName: '건반위의고양이', title: '신청곡 받아요 🎹 피아노 즉흥연주', category: '음악', tags: ['피아노', '신청곡'], viewerCount: 3200, followers: 22100, emoji: '🎵', notice: '신청곡은 후원 메시지 우선' },
  { id: 5, streamerId: 'u105', streamerName: '코딩장인', title: 'React 18 실시간 코드 리뷰 같이해요', category: '공부', tags: ['개발', '리액트'], viewerCount: 1800, followers: 9600, emoji: '📚', notice: '깃허브 링크는 매니저 확인 후 공유' },
  { id: 6, streamerId: 'u106', streamerName: '운동왕', title: '오늘도 3대 500 도전 💪 라이브 PT', category: '스포츠', tags: ['헬스'], viewerCount: 2400, followers: 18100, emoji: '🏃', notice: '자세 피드백은 영상 후반부' },
]

export function filterStreams(streams: Stream[], category: StreamCategory, query: string): Stream[] {
  const normalizedQuery = query.trim().toLowerCase()
  return streams.filter((stream) => {
    const matchesCategory = category === '전체' || stream.category === category
    const haystack = `${stream.title} ${stream.streamerName} ${stream.tags.join(' ')}`.toLowerCase()
    return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery))
  })
}

export function findStreamById(streams: Stream[], id: string | number | undefined): Stream | undefined {
  return streams.find((stream) => String(stream.id) === String(id))
}

export const useStreamStore = create<StreamState>((set) => ({
  streams: MOCK_STREAMS,
  category: '전체',
  query: '',
  setCategory: (category) => set({ category }),
  setQuery: (query) => set({ query }),
}))
