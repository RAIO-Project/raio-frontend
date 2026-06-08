import { useState } from 'react'

import { ChatPanel, useChat } from '@/features/chat'
import { DonationBox } from '@/features/donation'
import { VideoStage } from './VideoStage'

interface LiveRoomStream {
  id: string
  streamerId: string
  title: string
  category: string | null
  viewerCount?: number
  status: string
}

interface LiveRoomProps {
  stream: LiveRoomStream
}

export function LiveRoom({ stream }: LiveRoomProps) {
  const [followed, setFollowed] = useState(false)
  const chat = useChat(stream.id)

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="min-w-0 flex-1 overflow-y-auto p-4">
        <VideoStage stream={{ ...stream, viewerCount: stream.viewerCount ?? 0 }} />
        <section className="mt-4 rounded-[2rem] border border-border bg-bg-2 p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-cyan-600 text-lg font-black text-black">
              {stream.streamerId[0]}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-black leading-tight">{stream.title}</h1>
              <p className="mt-1 text-sm text-white/45">
                {stream.streamerId} · {stream.category ?? '기타'}
              </p>
            </div>
            <button
              onClick={() => setFollowed((prev) => !prev)}
              className={`rounded-xl px-4 py-2 text-xs font-black ${followed ? 'border border-border bg-bg-4 text-white/45' : 'bg-accent text-black'}`}
            >
              {followed ? '팔로잉' : '팔로우'}
            </button>
          </div>
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