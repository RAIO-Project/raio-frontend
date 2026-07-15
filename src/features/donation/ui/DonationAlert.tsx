import { useEffect, useRef, useState } from 'react'

import { donationGradeOf, type DonationGradeLevel } from '@/entities/donation'
import type { DonationAlertEvent } from '@/features/chat'
import { formatPoint } from '@/shared'

/** 한 건을 화면에 띄우는 시간. 연속 후원은 큐에 쌓여 순서대로 표시된다. */
const DISPLAY_MS = 5000

/**
 * 등급별 오버레이 연출. 금액 구간·이모지는 entities/donation 의 DONATION_GRADES 가 단일 기준이고,
 * 여기서는 등급(level)에 따른 화면 스타일만 정의한다.
 */
const TIER_STYLE: Record<DonationGradeLevel, {
  ring: string
  gradient: string
  accent: string
  glow: string
}> = {
  crown: {
    ring: 'border-accent-yellow/60',
    gradient: 'from-accent-yellow/25 to-orange-500/15',
    accent: 'text-accent-yellow',
    glow: 'shadow-[0_0_40px_-8px_rgba(245,166,35,0.6)]',
  },
  diamond: {
    ring: 'border-accent/50',
    gradient: 'from-accent/20 to-cyan-500/10',
    accent: 'text-accent',
    glow: 'shadow-[0_0_36px_-10px_rgba(0,229,255,0.5)]',
  },
  heart: {
    ring: 'border-accent-2/50',
    gradient: 'from-accent-2/20 to-rose-600/10',
    accent: 'text-accent-2',
    glow: 'shadow-[0_0_32px_-10px_rgba(255,75,110,0.5)]',
  },
}

interface DonationAlertProps {
  /** useChat 이 전달하는 최신 후원. 같은 id 는 한 번만 표시한다. */
  alert?: DonationAlertEvent | null
}

/**
 * 영상 위에 뜨는 후원 알림. 채팅 목록 표시와는 별개다.
 *
 * 후원이 몰려도 겹치지 않도록 큐에 쌓아 한 건씩 순서대로 보여준다.
 */
export function DonationAlert({ alert }: DonationAlertProps) {
  const [queue, setQueue] = useState<DonationAlertEvent[]>([])
  const [current, setCurrent] = useState<DonationAlertEvent | null>(null)
  // 리렌더로 같은 후원이 다시 들어와도 중복 표시하지 않는다
  const seenRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (!alert || seenRef.current.has(alert.id)) return
    seenRef.current.add(alert.id)
    setQueue((prev) => [...prev, alert])
  }, [alert])

  // 큐에 쌓인 다음 후원을 현재로 올린다 (표시 중이 아닐 때만)
  useEffect(() => {
    if (current || queue.length === 0) return
    setCurrent(queue[0])
    setQueue((prev) => prev.slice(1))
  }, [current, queue])

  // 현재 후원을 DISPLAY_MS 뒤 자동으로 내린다.
  // 타이머 등록은 위 큐 처리와 반드시 분리한다 — 한 effect 에 두면 setCurrent 로 current 가
  // 바뀌며 effect 가 재실행되고, 그 시점 cleanup 이 타이머를 즉시 지워 알림이 안 사라진다.
  useEffect(() => {
    if (!current) return
    const timer = setTimeout(() => setCurrent(null), DISPLAY_MS)
    return () => clearTimeout(timer)
  }, [current])

  if (!current) return null

  const grade = donationGradeOf(current.amount)
  const style = TIER_STYLE[grade.level]

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center p-4">
      <div
        key={current.id}
        className={`animate-slide-up w-full max-w-sm rounded-2xl border bg-gradient-to-br backdrop-blur-md ${style.ring} ${style.gradient} ${style.glow}`}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-2xl">{grade.emoji}</span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-white">
              {current.senderNickname}
              <span className="ml-1 text-white/60">님</span>
            </p>
            {current.message && (
              <p className="mt-0.5 truncate text-xs text-white/70">{current.message}</p>
            )}
          </div>

          <span className={`shrink-0 text-lg font-black ${style.accent}`}>
            {formatPoint(current.amount)}
          </span>
        </div>
      </div>
    </div>
  )
}
