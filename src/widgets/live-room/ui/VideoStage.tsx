import type { ChangeEvent } from 'react'
import { useRef, useState } from 'react'

import type { Stream } from '@/entities/stream'
import { formatCompactNumber } from '@/shared'

interface VideoStageProps {
  stream: Stream
}

export function VideoStage({ stream }: VideoStageProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [hasFile, setHasFile] = useState(false)
  const [playing, setPlaying] = useState(false)

  const loadVideo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !videoRef.current) return
    videoRef.current.src = URL.createObjectURL(file)
    void videoRef.current.play()
    setHasFile(true)
    setPlaying(true)
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video?.src) return
    if (video.paused) {
      void video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }
    void videoRef.current?.parentElement?.requestFullscreen()
  }

  return (
    <section className="relative aspect-video overflow-hidden rounded-[2rem] border border-border bg-black">
      {!hasFile && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-bg-3 to-bg-5 text-center">
          <div className="text-7xl opacity-40">{stream.emoji}</div>
          <h2 className="mt-3 text-xl font-black">{stream.streamerName} LIVE</h2>
          <p className="mt-1 text-xs text-white/40">방송 송출 API 연결 전, 로컬 영상으로 플레이어를 확인할 수 있습니다.</p>
          <button onClick={() => inputRef.current?.click()} className="mt-4 rounded-xl bg-accent px-4 py-2 text-xs font-black text-black">
            테스트 영상 선택
          </button>
          <input ref={inputRef} type="file" accept="video/*" onChange={loadVideo} className="hidden" />
        </div>
      )}
      <video ref={videoRef} onEnded={() => setPlaying(false)} className={`h-full w-full object-contain ${hasFile ? 'block' : 'hidden'}`} />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex justify-between">
          <span className="rounded-md bg-red-500 px-2.5 py-1 text-[10px] font-black text-white">● LIVE</span>
          <span className="rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white">👁 {formatCompactNumber(stream.viewerCount)}</span>
        </div>
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-black/60 p-2 backdrop-blur">
          <button onClick={togglePlay} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-black">{playing ? '⏸' : '▶'}</button>
          <div className="h-1 flex-1 rounded-full bg-white/15"><div className="h-full w-1/3 rounded-full bg-accent" /></div>
          <button onClick={toggleFullScreen} className="rounded-xl bg-white/10 px-3 py-2 text-sm">⛶</button>
        </div>
      </div>
    </section>
  )
}
