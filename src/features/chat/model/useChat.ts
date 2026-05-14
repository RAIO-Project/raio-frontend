import { useCallback, useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

import type { ChatMessage } from '@/entities/chat'
import { useUserStore } from '@/features/user'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080'

const seedMessages: ChatMessage[] = [
  { id: 1, type: 'notice', text: '욕설·도배는 운영 정책에 따라 제한됩니다.' },
  { id: 2, type: 'donation', senderNickname: '도네왕', amount: 1000, text: '오늘 꼭 성공하자!' },
  { id: 3, type: 'chat', role: 'admin', senderNickname: '관리자', text: '신규 시청자 환영합니다.' },
  { id: 4, type: 'chat', role: 'normal', senderNickname: '하늘별', text: 'ㅋㅋㅋ 오늘 텐션 좋다' },
]

interface ServerChatMessage {
  senderNickname?: string
  message?: string
  amount?: number
}

export function useChat(streamId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages)
  const [connected, setConnected] = useState(false)
  const idRef = useRef(100)
  const clientRef = useRef<Client | null>(null)
  const user = useUserStore((state) => state.user)
  const token = useUserStore((state) => state.token)

  useEffect(() => {
    if (!streamId) return undefined

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_URL}/ws`),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        client.subscribe(`/sub/chat/${streamId}`, (frame) => {
          const body = JSON.parse(frame.body) as ServerChatMessage
          setMessages((prev) => [
            ...prev,
            {
              id: idRef.current++,
              type: 'chat',
              role: 'normal',
              senderNickname: body.senderNickname ?? '익명',
              text: body.message ?? '',
            },
          ])
        })
        client.subscribe(`/sub/donation/${streamId}`, (frame) => {
          const body = JSON.parse(frame.body) as ServerChatMessage
          setMessages((prev) => [
            ...prev,
            {
              id: idRef.current++,
              type: 'donation',
              senderNickname: body.senderNickname ?? '익명',
              amount: body.amount ?? 0,
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
  }, [streamId, token])

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !user) return

      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current++,
          type: 'chat',
          role: 'me',
          senderNickname: user.nickname || '나',
          text,
        },
      ])

      if (connected && clientRef.current?.connected) {
        clientRef.current.publish({
          destination: `/pub/chat/${streamId}`,
          body: JSON.stringify({ userId: user.id, senderNickname: user.nickname, message: text }),
        })
      }
    },
    [connected, streamId, user],
  )

  const pushDonation = useCallback(
    (amount: number, text: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current++,
          type: 'donation',
          senderNickname: user?.nickname || '익명',
          amount,
          text,
        },
      ])
    },
    [user],
  )

  return { messages, connected, sendMessage, pushDonation }
}
