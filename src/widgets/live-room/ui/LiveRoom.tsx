import { useState } from 'react'

import type { Stream } from '@/entities/stream'
import { ChatPanel, useChat } from '@/features/chat'
import { DonationBox } from '@/features/donation'
import { formatCompactNumber } from '@/shared'
import { VideoStage } from './VideoStage'

interface LiveRoomProps {
  stream: Stream
}

export function LiveRoom({ stream }: LiveRoomProps) {
  const [followed, setFollowed] = useState(false)
  const chat = useChat(stream.id)

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="min-w-0 flex-1 overflow-y-auto p-4">
        <VideoStage stream={stream} />
        <section className="mt-4 rounded-[2rem] border border-border bg-bg-2 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-cyan-600 text-lg font-black text-black">
              {stream.streamerName[0]}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-black leading-tight">{stream.title}</h1>
              <p className="mt-1 text-sm text-white/45">
                {stream.streamerName} · 팔로워 {formatCompactNumber(stream.followers)}명 · {stream.category}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {stream.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-bg-4 px-2 py-1 text-[10px] font-bold text-white/40">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setFollowed((prev) => !prev)}
              className={`rounded-xl px-4 py-2 text-xs font-black ${followed ? 'border border-border bg-bg-4 text-white/45' : 'bg-accent text-black'}`}
            >
              {followed ? '팔로잉' : '팔로우'}
            </button>
          </div>
          <div className="mt-4 rounded-2xl border border-accent/10 bg-accent/5 p-4 text-sm text-white/65">📌 {stream.notice}</div>
        </section>
        <div className="mt-4">
          <DonationBox onDonate={chat.pushDonation} />
        </div>
      </div>
      <div className="hidden w-[330px] shrink-0 border-l border-border lg:block">
        <ChatPanel messages={chat.messages} connected={chat.connected} onSend={chat.sendMessage} />
      </div>
    </div>
  )
}
