import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import type { ChatMessage, ChatRole } from '@/entities/chat'
import { useUserStore } from '@/features/user'
import { formatPoint } from '@/shared'

const nickTone: Record<ChatRole, string> = {
  streamer: 'text-accent',
  admin: 'text-accent',
  donor: 'text-accent-2',
  me: 'text-accent-green',
  normal: 'text-[#9ca3c8]',
}

interface ChatPanelProps {
  messages: ChatMessage[]
  connected: boolean
  onSend: (message: string) => void
}

export function ChatPanel({ messages, connected, onSend }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const stickToBottom = useRef(true)
  const token = useUserStore((state) => state.token)

  // 사용자가 맨 아래 근처에 있을 때만 자동 스크롤 (위로 올려 과거글 읽는 중이면 안 끌어내림)
  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }

  useEffect(() => {
    if (stickToBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const submit = () => {
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <aside className="flex h-full flex-col bg-bg-2">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <b className="text-xs">실시간 채팅</b>
        <span className="flex items-center gap-1 text-[11px] text-white/40">
          <i className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-accent-green' : 'bg-white/20'}`} />
          {connected ? '연결됨' : '연결 중…'}
        </span>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="min-h-0 flex-1 overflow-y-auto py-2">
        {messages.map((msg) => {
          if (msg.type === 'notice') {
            return (
              <div key={msg.id} className="mx-3 my-2 rounded-xl border border-accent/10 bg-accent/5 px-3 py-2 text-[11px] text-white/45">
                📢 {msg.text}
              </div>
            )
          }

          if (msg.type === 'donation') {
            return (
              <div key={msg.id} className="mx-3 my-2 rounded-xl border border-accent-2/25 bg-accent-2/10 px-3 py-2">
                <p className="text-[11px] font-black text-accent-2">
                  💝 {msg.senderNickname}님 {formatPoint(msg.amount ?? 0)} 후원
                </p>
                {msg.text && <p className="mt-1 text-[11px] text-white/60">“{msg.text}”</p>}
              </div>
            )
          }

          const role = msg.role ?? 'normal'
          // 블라인드된 메시지는 흐리게 + 이탤릭
          if (msg.blinded) {
            return (
              <p key={msg.id} className="px-3 py-1 text-xs italic leading-relaxed text-white/30">
                {msg.text}
              </p>
            )
          }

          const isStreamer = role === 'streamer'
          return (
            <p
              key={msg.id}
              className={`px-3 py-1 text-xs leading-relaxed hover:bg-white/[0.03] ${
                isStreamer ? 'border-l-2 border-accent bg-accent/[0.06]' : ''
              }`}
            >
              {isStreamer && (
                <span className="mr-1 inline-flex items-center rounded bg-accent px-1 py-px align-[1px] text-[9px] font-black leading-none tracking-tight text-black">
                  스트리머
                </span>
              )}
              <b className={`mr-1.5 ${nickTone[role]}`}>{msg.senderNickname}</b>
              <span className="break-words text-white/80">{msg.text}</span>
            </p>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-3">
        {token ? (
          <div className="rounded-2xl border border-border bg-bg-3 p-2 focus-within:border-accent/40">
            <input
              value={input}
              maxLength={200}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                // 한글 IME 조합 중 Enter(글자 확정)는 전송하지 않음
                if (event.key === 'Enter' && !event.nativeEvent.isComposing) submit()
              }}
              className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-white/25"
              placeholder="채팅을 입력하세요"
            />
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] text-white/25">{input.length}/200</span>
              <button onClick={submit} className="text-xs font-black text-accent">
                전송
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-bg-3 p-4 text-center text-xs text-white/40">
            채팅하려면 <Link className="font-black text-accent" to="/login">로그인</Link>하세요.
          </div>
        )}
      </div>
    </aside>
  )
}
