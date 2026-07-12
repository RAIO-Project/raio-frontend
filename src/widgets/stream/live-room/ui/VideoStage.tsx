import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { formatCompactNumber } from '@/shared'
import { uploadVideo } from '@/entities/stream'
import type { VideoSyncEvent } from '@/features/chat'

interface VideoStageProps {
  stream: {
    streamerId: string
    title: string
    viewerCount: number
  }
  isOwner: boolean
  videoEvent?: VideoSyncEvent | null
  onVideoSync?: (event: VideoSyncEvent) => void
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

export function VideoStage({ stream, isOwner, videoEvent, onVideoSync }: VideoStageProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const videoUrlRef = useRef<string>('')

  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [playing, setPlaying] = useState(false)
  // 시청자 자동재생 차단 시 표시할 클릭 오버레이
  const [needsClick, setNeedsClick] = useState(false)

  // 시청자: 방장이 보낸 VIDEO 이벤트 수신 → 영상 로드 및 재생 동기화
  useEffect(() => {
    if (!videoEvent || isOwner) return
    const video = videoRef.current
    if (!video || !videoEvent.videoUrl) return

    const tryPlay = () => {
      video.play().then(() => {
        setPlaying(true)
        setNeedsClick(false)
      }).catch(() => {
        // 브라우저 자동재생 차단 → 클릭 버튼 표시
        setNeedsClick(true)
      })
    }

    const isSameUrl = video.src === videoEvent.videoUrl

    if (!isSameUrl) {
      const onCanPlay = () => {
        if (Math.abs(video.currentTime - videoEvent.currentTime) > 2) {
          video.currentTime = videoEvent.currentTime
        }
        if (videoEvent.playing) tryPlay()
      }
      video.addEventListener('canplay', onCanPlay, { once: true })
      video.src = videoEvent.videoUrl
      video.load()
      setUploadState('done')
    } else {
      if (Math.abs(video.currentTime - videoEvent.currentTime) > 2) {
        video.currentTime = videoEvent.currentTime
      }
      if (videoEvent.playing && video.paused) {
        tryPlay()
      } else if (!videoEvent.playing && !video.paused) {
        video.pause()
        setPlaying(false)
      }
    }
  }, [videoEvent, isOwner])

  // 방장: 5초마다 현재 재생 상태를 시청자들에게 브로드캐스트
  useEffect(() => {
    if (!isOwner || !onVideoSync) return
    syncIntervalRef.current = setInterval(() => {
      const video = videoRef.current
      if (!video || !videoUrlRef.current) return
      onVideoSync({
        videoUrl: videoUrlRef.current,
        currentTime: video.currentTime,
        playing: !video.paused,
      })
    }, 5000)
    return () => {
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current)
    }
  }, [isOwner, onVideoSync])

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !videoRef.current) return

    setUploadState('uploading')
    setProgress(0)
    setErrorMsg('')

    try {
      const result = await uploadVideo(file, file.name, setProgress)
      videoUrlRef.current = result.videoUrl
      videoRef.current.src = result.videoUrl
      void videoRef.current.play()
      setUploadState('done')
      setPlaying(true)

      // 업로드 완료 직후 즉시 브로드캐스트
      onVideoSync?.({ videoUrl: result.videoUrl, currentTime: 0, playing: true })
    } catch (err: unknown) {
      setUploadState('error')
      const axiosErr = err as { response?: { status: number; data?: { message?: string } } }
      const status = axiosErr?.response?.status
      const msg = axiosErr?.response?.data?.message
      setErrorMsg(`업로드 실패 (${status ?? 'network'})${msg ? ': ' + msg : ''}`)
      console.error('[VideoStage] upload error', err)
    }

    event.target.value = ''
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video?.src) return
    if (video.paused) {
      void video.play()
      setPlaying(true)
      onVideoSync?.({ videoUrl: videoUrlRef.current, currentTime: video.currentTime, playing: true })
    } else {
      video.pause()
      setPlaying(false)
      onVideoSync?.({ videoUrl: videoUrlRef.current, currentTime: video.currentTime, playing: false })
    }
  }

  const handleViewerClick = () => {
    const video = videoRef.current
    if (!video) return
    video.play().then(() => {
      setPlaying(true)
      setNeedsClick(false)
    }).catch(console.error)
  }

  const toggleFullScreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }
    void videoRef.current?.parentElement?.requestFullscreen()
  }

  const isDone = uploadState === 'done'

  return (
    <section className="relative aspect-video overflow-hidden rounded-[2rem] border border-border bg-black">
      {!isDone && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-bg-3 to-bg-5 text-center">
          {uploadState === 'idle' && (
            <>
              <div className="text-7xl opacity-40">📺</div>
              <h2 className="mt-3 text-xl font-black">{stream.title}</h2>
              {isOwner ? (
                <>
                  <p className="mt-1 text-xs text-white/40">동영상을 업로드하면 파일 서버에 저장 후 재생됩니다.</p>
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="mt-4 rounded-xl bg-accent px-4 py-2 text-xs font-black text-black"
                  >
                    동영상 업로드
                  </button>
                </>
              ) : (
                <p className="mt-1 text-xs text-white/40">방송 송출 연결 전입니다.</p>
              )}
            </>
          )}

          {uploadState === 'uploading' && (
            <>
              <div className="text-5xl opacity-60">⬆️</div>
              <p className="mt-3 text-sm font-bold">업로드 중...</p>
              <div className="mt-3 w-48 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-accent transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-white/40">{progress}%</p>
            </>
          )}

          {uploadState === 'error' && (
            <>
              <div className="text-5xl opacity-60">⚠️</div>
              <p className="mt-3 text-sm font-bold text-red-400">{errorMsg}</p>
              <button
                onClick={() => { setUploadState('idle'); inputRef.current?.click() }}
                className="mt-4 rounded-xl bg-accent px-4 py-2 text-xs font-black text-black"
              >
                다시 시도
              </button>
            </>
          )}

          <input ref={inputRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
        </div>
      )}

      <video
        ref={videoRef}
        onEnded={() => setPlaying(false)}
        className={`h-full w-full object-contain ${isDone ? 'block' : 'hidden'}`}
      />

      {/* 시청자 자동재생 차단 시 클릭 유도 오버레이 */}
      {isDone && !isOwner && needsClick && (
        <button
          onClick={handleViewerClick}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <span className="text-3xl">▶</span>
          </div>
          <p className="mt-3 text-sm font-bold text-white">클릭하여 재생</p>
        </button>
      )}

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex justify-between">
          <span className="rounded-md bg-red-500 px-2.5 py-1 text-[10px] font-black text-white">● LIVE</span>
          <span className="rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white">👁 {formatCompactNumber(stream.viewerCount)}</span>
        </div>
        {isDone && isOwner && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-black/60 p-2 backdrop-blur">
            <button onClick={togglePlay} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-black">
              {playing ? '⏸' : '▶'}
            </button>
            <div className="h-1 flex-1 rounded-full bg-white/15">
              <div className="h-full w-1/3 rounded-full bg-accent" />
            </div>
            <button onClick={toggleFullScreen} className="rounded-xl bg-white/10 px-3 py-2 text-sm">⛶</button>
          </div>
        )}
      </div>
    </section>
  )
}
