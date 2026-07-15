import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { endStream } from '@/entities/stream'
import { ChatPanel, useChat } from '@/features/chat'
import { DonationBox } from '@/features/donation'
import { useUserStore } from '@/features/user'
import { VideoStage } from './VideoStage'

// Stream(목록) / StreamDetail(상세) 공통으로 받는 최소 형태
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
  const navigate = useNavigate()
  const [followed, setFollowed] = useState(false)
  const [ending, setEnding] = useState(false)
  const [ended, setEnded] = useState(false)
  const user = useUserStore((state) => state.user)
  const chat = useChat(stream.id, stream.streamerId)
  const isOwner = !!user && String(user.id) === stream.streamerId

  const handleEnd = async () => {
    if (ending) return
    const ok = window.confirm('방송을 종료하시겠습니까?\n종료하면 시청자 연결이 끊기고 목록에서 사라집니다.')
    if (!ok) return
    setEnding(true)
    try {
      await endStream(stream.id)
      setEnded(true)
    } catch {
      window.alert('방송 종료에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setEnding(false)
    }
  }

  // 스트리머가 종료했거나(본인), 시청 중 방송이 종료되면(시청자) 종료 화면
  if (ended || chat.streamEnded) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-black text-white">방송이 종료되었습니다.</p>
        <button onClick={() => navigate('/')} className="rounded-xl bg-accent px-5 py-2 text-sm font-black text-black">
          홈으로
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="min-w-0 flex-1 overflow-y-auto p-4">
        {/* 영상: 본인은 업로드/제어, 시청자는 동기화 재생 (친구 구현 유지) */}
        <VideoStage
          stream={{ ...stream, viewerCount: chat.viewerCount ?? stream.viewerCount ?? 0 }}
          //                                 ^^^^^^^^^^^^^^^^ 실시간 값 우선, 없으면 API 값
          isOwner={isOwner}
          videoEvent={chat.videoEvent}
          onVideoSync={chat.sendVideoSync}
          donationAlert={chat.donationAlert}
        />

        {isOwner ? (
          /* 스트리머 본인: 스튜디오(방송 관리) — 팔로우/후원 없음, 종료 버튼 */
          <section className="mt-4 rounded-[2rem] border border-border bg-bg-2 p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md bg-accent/15 px-2 py-1 text-xs font-black text-accent">🎬 스튜디오</span>
              <span className="text-xs text-white/40">내 방송 관리</span>
            </div>
            <h1 className="text-xl font-black leading-tight">{stream.title}</h1>
            <p className="mt-1 text-sm text-white/45">{stream.category ?? '기타'}</p>

            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="mb-2 text-sm font-bold text-white/80">방송 종료</p>
              <p className="mb-3 text-xs text-white/40">종료하면 시청자 연결이 끊기고 목록에서 사라집니다.</p>
              <button
                onClick={handleEnd}
                disabled={ending}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-black text-white hover:bg-red-600 disabled:opacity-50"
              >
                {ending ? '종료 중…' : '방송 종료'}
              </button>
            </div>
          </section>
        ) : (
          /* 시청자: 방송 정보 + 팔로우 + 후원 (기존 그대로) */
          <>
            <section className="mt-4 rounded-[2rem] border border-border bg-bg-2 p-5">
              <div className="flex items-start gap-4">
                {/* TODO(streamer): 백엔드가 스트리머 닉네임을 내려주면 이니셜/프로필로 교체 */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-cyan-600 text-xl text-black">
                  📺
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-black leading-tight">{stream.title}</h1>
                  <p className="mt-1 text-sm text-white/45">
                    {stream.category ?? '기타'}
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
              <DonationBox streamId={stream.id} streamerId={stream.streamerId} />
            </div>
          </>
        )}
      </div>
      <div className="hidden w-[330px] shrink-0 border-l border-border lg:block">
        <ChatPanel messages={chat.messages} connected={chat.connected} onSend={chat.sendMessage} />
      </div>
    </div>
  )
}
