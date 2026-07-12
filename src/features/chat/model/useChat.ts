import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'

import type { ChatMessage } from '@/entities/chat'
import { useUserStore } from '@/features/user'

const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'
const MAX_MESSAGES = 200 // 라이브 장시간 시청 시 메모리/렌더 부담 방지

interface ServerRelayEvent {
  type?: string // "CHAT" | "JOIN" | "LEAVE" | "DONATION" | "BLIND" | "VIDEO" | "VIEWER_COUNT"
  streamId?: string
  chatId?: string
  userId?: string
  senderNickname?: string
  nickname?: string
  message?: string
  amount?: number
  reason?: string
  isBlocked?: boolean
  // VIDEO
  videoUrl?: string
  currentTime?: number
  playing?: boolean
  // VIEWER_COUNT
  viewerCount?: number
}

export interface VideoSyncEvent {
  videoUrl: string
  currentTime: number
  playing: boolean
}

/**
 * @param streamerId 방송 주인. 채팅에서 스트리머를 구분해 표시하는 데 쓴다.
 */
export function useChat(streamId: string, streamerId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)
  const [videoEvent, setVideoEvent] = useState<VideoSyncEvent | null>(null)
  // 실시간 시청자 수. 구독/연결해제 시 서버가 보내준다. null = 아직 못 받음(초기 API 값 사용)
  const [viewerCount, setViewerCount] = useState<number | null>(null)
  const idRef = useRef(1)
  const clientRef = useRef<Client | null>(null)
  const user = useUserStore((state) => state.user)
  const token = useUserStore((state) => state.token)

  useEffect(() => {
    if (!streamId) return undefined

    const append = (msg: ChatMessage) =>
      setMessages((prev) => {
        const next = [...prev, msg]
        return next.length > MAX_MESSAGES ? next.slice(-MAX_MESSAGES) : next
      })

    // 인증: STOMP CONNECT 헤더에 JWT. 토큰 없으면 익명(비회원) 연결 → 읽기만 가능.
    const client = new Client({
      brokerURL: `${WS_BASE}/ws/chat`,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        client.subscribe(`/topic/streams/${streamId}`, (frame) => {
          const body = JSON.parse(frame.body) as ServerRelayEvent
          // VideoMessage는 type을 record component로 가지지 않아 JSON에 누락될 수 있음 → videoUrl로 보완 판별
          const type = body.type ?? (body.videoUrl ? 'VIDEO' : 'CHAT')

          if (type === 'VIDEO') {
            setVideoEvent({
              videoUrl: body.videoUrl ?? '',
              currentTime: body.currentTime ?? 0,
              playing: body.playing ?? false,
            })
            return
          }

          // 실시간 시청자 수: 누군가 입장/퇴장할 때마다 갱신된 값이 온다.
          if (type === 'VIEWER_COUNT') {
            setViewerCount(body.viewerCount ?? 0)
            return
          }

          // 모더레이션 블라인드: 해당 chatId 메시지를 가림(내용 치환).
          if (type === 'BLIND') {
            setMessages((prev) =>
              prev.map((m) =>
                m.chatId && m.chatId === body.chatId
                  ? { ...m, blinded: true, text: '운영 정책에 의해 가려진 메시지입니다.' }
                  : m,
              ),
            )
            return
          }

          if (type === 'JOIN' || type === 'LEAVE') {
            append({
              id: idRef.current++,
              type: 'notice',
              text: `${body.nickname ?? '누군가'}님이 ${type === 'JOIN' ? '입장' : '퇴장'}했습니다.`,
            })
            return
          }

          if (type === 'DONATION') {
            append({
              id: idRef.current++,
              type: 'donation',
              senderNickname: body.senderNickname ?? body.nickname ?? '익명',
              amount: body.amount ?? 0,
              text: body.message ?? '',
            })
            return
          }

          // CHAT — chatId 보관(BLIND 매칭용)
          // 방송 주인이면 스트리머로 표시. 내가 스트리머여도 스트리머 표시가 우선이다.
          const isStreamer = !!streamerId && !!body.userId && body.userId === streamerId
          const isMe = !!body.userId && !!user && body.userId === String(user.id)

          append({
            id: idRef.current++,
            chatId: body.chatId,
            type: 'chat',
            role: isStreamer ? 'streamer' : isMe ? 'me' : 'normal',
            senderNickname: body.senderNickname ?? body.nickname ?? '익명',
            text: body.message ?? '',
          })
        })
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
    })

    client.activate()
    clientRef.current = client

    return () => {
      void client.deactivate()
      clientRef.current = null
      setConnected(false)
    }
  }, [streamId, streamerId, token, user])

  const sendVideoSync = useCallback(
    (event: VideoSyncEvent) => {
      if (!clientRef.current?.connected) return
      clientRef.current.publish({
        destination: `/app/streams/${streamId}/video`,
        body: JSON.stringify(event),
      })
    },
    [streamId],
  )

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !user) return
      if (!clientRef.current?.connected) return
      clientRef.current.publish({
        destination: `/app/streams/${streamId}/chat`,
        body: JSON.stringify({ message: text.trim() }),
      })
    },
    [user, streamId],
  )

  return { messages, connected, sendMessage, videoEvent, sendVideoSync, viewerCount }
}