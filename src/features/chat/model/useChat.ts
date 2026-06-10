import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'

import type { ChatMessage } from '@/entities/chat'
import { useUserStore } from '@/features/user'

// 백엔드 WebSocket 베이스 (예: ws://localhost:8080). REST 와 별도 env.
const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:8080'

// 서버 → 클라 브로드캐스트 페이로드 (ChatWebSocketDto.ChatBroadcastEvent / StreamPresenceEvent)
interface ServerRelayEvent {
  type?: string // "CHAT" | "JOIN" | "LEAVE" (도네이션 추가 시 "DONATION")
  streamId?: string
  userId?: string
  senderNickname?: string
  nickname?: string
  message?: string
  amount?: number
  isBlocked?: boolean
}

export function useChat(streamId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connected, setConnected] = useState(false)
  const idRef = useRef(1)
  const clientRef = useRef<Client | null>(null)
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    if (!streamId) return undefined

    // 인증: StompAuthInterceptor 가 쿼리파라미터(userId, nickname)를 읽는다.
    // 비로그인 시에도 구독(보기)은 가능하도록 연결은 시도한다.
    const nickname = user?.nickname || (user ? `유저${user.id}` : '익명')
    const params = user ? `?userId=${user.id}&nickname=${encodeURIComponent(nickname)}` : ''

    const client = new Client({
      brokerURL: `${WS_BASE}/ws/chat${params}`,
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        // 백엔드 토픽: /topic/streams/{streamId} (CHAT/JOIN/LEAVE 가 섞여 옴)
        client.subscribe(`/topic/streams/${streamId}`, (frame) => {
          const body = JSON.parse(frame.body) as ServerRelayEvent
          const t = body.type ?? 'CHAT'

          if (t === 'JOIN' || t === 'LEAVE') {
            setMessages((prev) => [
              ...prev,
              {
                id: idRef.current++,
                type: 'notice',
                text: `${body.nickname ?? '누군가'}님이 ${t === 'JOIN' ? '입장' : '퇴장'}했습니다.`,
              },
            ])
            return
          }

          if (t === 'DONATION') {
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

          // CHAT
          setMessages((prev) => [
            ...prev,
            {
              id: idRef.current++,
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
  }, [streamId, user])

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !user) return
      if (!clientRef.current?.connected) return

      // 백엔드: @MessageMapping("/streams/{streamId}/chat"), prefix "/app"
      // 페이로드: ChatSendCommand { message } 만. userId/nickname 은 서버가 세션에서 가져옴.
      clientRef.current.publish({
        destination: `/app/streams/${streamId}/chat`,
        body: JSON.stringify({ message: text.trim() }),
      })
      // 낙관적 표시 안 함: 서버 브로드캐스트가 돌아오면 구독 콜백에서 추가됨(에코)
    },
    [user, streamId],
  )

  return { messages, connected, sendMessage }
}