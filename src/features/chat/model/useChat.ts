import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'

import type { ChatMessage } from '@/entities/chat'
import { useUserStore } from '@/features/user'

// 백엔드 WebSocket 베이스 (예: ws://localhost:8080). REST 와 별도 env.
const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'

// 서버 → 클라 브로드캐스트 페이로드 (type 으로 분기)
interface ServerRelayEvent {
  type?: string // "CHAT" | "JOIN" | "LEAVE" | "DONATION" | "BLIND"
  streamId?: string
  chatId?: string
  userId?: string
  senderNickname?: string
  nickname?: string
  message?: string
  amount?: number
  reason?: string
  isBlocked?: boolean
}

export function useChat(streamId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)
  const idRef = useRef(1)
  const clientRef = useRef<Client | null>(null)
  const user = useUserStore((state) => state.user)
  const token = useUserStore((state) => state.token)

  useEffect(() => {
    if (!streamId) return undefined

    // 인증: STOMP CONNECT 헤더에 JWT. 토큰 없으면 익명(비회원) 연결 → 읽기만 가능.
    const client = new Client({
      brokerURL: `${WS_BASE}/ws/chat`,
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        client.subscribe(`/topic/streams/${streamId}`, (frame) => {
          const body = JSON.parse(frame.body) as ServerRelayEvent
          const type = body.type ?? 'CHAT'

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
            setMessages((prev) => [
              ...prev,
              {
                id: idRef.current++,
                type: 'notice',
                text: `${body.nickname ?? '누군가'}님이 ${type === 'JOIN' ? '입장' : '퇴장'}했습니다.`,
              },
            ])
            return
          }

          if (type === 'DONATION') {
            setMessages((prev) => [
              ...prev,
              {
                id: idRef.current++,
                type: 'donation',
                senderNickname: body.senderNickname ?? body.nickname ?? '익명',
                amount: body.amount ?? 0,
                text: body.message ?? '',
              },
            ])
            return
          }

          // CHAT — chatId 보관(BLIND 매칭용)
          setMessages((prev) => [
            ...prev,
            {
              id: idRef.current++,
              chatId: body.chatId,
              type: 'chat',
              role: body.userId && user && body.userId === String(user.id) ? 'me' : 'normal',
              senderNickname: body.senderNickname ?? '익명',
              text: body.message ?? '',
            },
          ])
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
  }, [streamId, token, user])

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !user) return
      if (!clientRef.current?.connected) return
      // 페이로드: { message } 만. 신원(userId)은 서버가 CONNECT 토큰에서 가져옴.
      clientRef.current.publish({
        destination: `/app/streams/${streamId}/chat`,
        body: JSON.stringify({ message: text.trim() }),
      })
    },
    [user, streamId],
  )

  return { messages, connected, sendMessage }
}