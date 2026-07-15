import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'

import type { ChatMessage } from '@/entities/chat'
import { useUserStore } from '@/features/user'

const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'
const MAX_MESSAGES = 200 // 라이브 장시간 시청 시 메모리/렌더 부담 방지

interface ServerRelayEvent {
  type?: string // "CHAT" | "JOIN" | "LEAVE" | "DONATION" | "BLIND" | "VIDEO" | "VIEWER_COUNT" | "STREAM_ENDED"
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

/** 영상 위 오버레이로 띄울 후원. 채팅 기록과 별개로 전달된다. */
export interface DonationAlertEvent {
  id: number
  senderNickname: string
  amount: number
  message: string
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
  // 방송 종료. 스트리머가 종료하면 시청 중인 사용자에게 전달된다.
  const [streamEnded, setStreamEnded] = useState(false)
  // 최신 후원. 오버레이가 큐에 쌓아 순서대로 띄운다.
  const [donationAlert, setDonationAlert] = useState<DonationAlertEvent | null>(null)
  const idRef = useRef(1)
  const clientRef = useRef<Client | null>(null)
  const user = useUserStore((state) => state.user)
  const token = useUserStore((state) => state.token)

  // 객체(user)를 의존성에 두면 참조가 바뀔 때마다 재연결되므로 원시값으로 고정
  const userId = user?.id != null ? String(user.id) : null

  useEffect(() => {
    if (!streamId) return undefined

    // 로그인/로그아웃으로 재연결될 때, 정리된 옛 클라이언트의 콜백이
    // 새 연결의 상태를 덮어쓰지 않도록 막는다. (deactivate 는 비동기라 콜백이 늦게 온다)
    let cancelled = false

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
        if (cancelled) return
        setConnected(true)
        client.subscribe(`/topic/streams/${streamId}`, (frame) => {
          if (cancelled) return
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

          // 방송 종료: 시청 중이던 사용자에게 종료 화면을 띄운다.
          if (type === 'STREAM_ENDED') {
            setStreamEnded(true)
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
            const id = idRef.current++
            const senderNickname = body.senderNickname ?? body.nickname ?? '익명'
            const amount = body.amount ?? 0
            const text = body.message ?? ''

            append({ id, type: 'donation', senderNickname, amount, text })
            // 채팅 기록과 별개로 영상 위 오버레이에도 띄운다
            setDonationAlert({ id, senderNickname, amount, message: text })
            return
          }

          // CHAT — chatId 보관(BLIND 매칭용)
          // 방송 주인이면 스트리머로 표시. 내가 스트리머여도 스트리머 표시가 우선이다.
          const isStreamer = !!streamerId && !!body.userId && body.userId === streamerId
          const isMe = !!body.userId && !!userId && body.userId === userId

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
      onDisconnect: () => {
        if (!cancelled) setConnected(false)
      },
      onStompError: () => {
        if (!cancelled) setConnected(false)
      },
      onWebSocketClose: () => {
        if (!cancelled) setConnected(false)
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      cancelled = true // 이후 이 클라이언트의 콜백은 모두 무시한다
      void client.deactivate()
      clientRef.current = null
      setConnected(false)
    }
  }, [streamId, streamerId, token, userId])

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
      if (!text.trim() || !userId) return
      if (!clientRef.current?.connected) return
      clientRef.current.publish({
        destination: `/app/streams/${streamId}/chat`,
        body: JSON.stringify({ message: text.trim() }),
      })
    },
    [userId, streamId],
  )

  return {
    messages,
    connected,
    sendMessage,
    videoEvent,
    sendVideoSync,
    viewerCount,
    streamEnded,
    donationAlert,
  }
}