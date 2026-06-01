import { create } from 'zustand'

import { fetchStreamsByViewer, fetchStreamsLatest } from '../api/streamApi'
import { CATEGORY_LABELS, type Stream, type StreamCategoryLabel, type StreamSort } from './streamTypes'

interface StreamState {
  streams: Stream[]
  category: StreamCategoryLabel
  query: string
  sort: StreamSort
  loading: boolean
  error: string | null
  setCategory: (category: StreamCategoryLabel) => void
  setQuery: (query: string) => void
  setSort: (sort: StreamSort) => void
  loadStreams: () => Promise<void>
}

export const CATEGORIES = CATEGORY_LABELS

export const useStreamStore = create<StreamState>((set, get) => ({
  streams: [],
  category: '전체',
  query: '',
  sort: 'viewer',
  loading: false,
  error: null,

  setCategory: (category) => {
    set({ category })
    void get().loadStreams()
  },
  setQuery: (query) => set({ query }),
  setSort: (sort) => {
    set({ sort })
    void get().loadStreams()
  },

  loadStreams: async () => {
    const { category, query, sort } = get()
    set({ loading: true, error: null })
    try {
      const streams =
        sort === 'viewer'
          ? await fetchStreamsByViewer({ category, query })
          : await fetchStreamsLatest({ category, query })
      set({ streams, loading: false })
    } catch (e) {
      set({ loading: false, error: '방송 목록을 불러오지 못했습니다.' })
    }
  },
}))

export type { Stream, StreamCategoryLabel, StreamSort } from './streamTypes'