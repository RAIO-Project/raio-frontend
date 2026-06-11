import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { CATEGORY_LABELS, createStream, startStream, type StreamCategoryLabel } from '@/entities/stream'
import { useUserStore } from '@/features/user'
import { cx, ToastHost } from '@/shared'
import { AppHeader } from '@/widgets/layout'

// '전체'는 필터 전용이라 생성 폼에선 제외
const SELECTABLE_CATEGORIES = CATEGORY_LABELS.filter((c) => c !== '전체') as Exclude<
  StreamCategoryLabel,
  '전체'
>[]

export function StreamStudioPage() {
  const navigate = useNavigate()
  const user = useUserStore((state) => state.user)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<Exclude<StreamCategoryLabel, '전체'>>('게임')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 로그인 안 했으면 생성 불가
  if (!user) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-bg">
        <AppHeader />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-sm text-white/50">
          방송을 만들려면 로그인이 필요합니다.
          <button
            onClick={() => navigate('/login')}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-black text-black"
          >
            로그인
          </button>
        </div>
        <ToastHost />
      </div>
    )
  }

  const canSubmit = title.trim().length > 0 && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)
    try {
      // 1) 개설(READY) → 2) 시작(LIVE) 까지 한 번에
      const created = await createStream({
        streamerId: String(user.id),
        title: title.trim(),
        category,
      })
      await startStream(created.id)
      // 생성+시작 후 방송 상세로 이동
      navigate(`/stream/${created.id}`)
    } catch (e) {
      setError('방송을 만들지 못했습니다. 잠시 후 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <AppHeader />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl p-6">
          <button onClick={() => navigate('/')} className="mb-4 text-xs text-white/40 hover:text-white">
            ← 홈
          </button>

          <h1 className="text-2xl font-black">방송 만들기</h1>
          <p className="mt-1 text-sm text-white/45">제목과 카테고리를 설정하고 방송을 시작하세요.</p>

          <div className="mt-6 space-y-6 rounded-[2rem] border border-border bg-bg-2 p-6">
            {/* 제목 */}
            <div>
              <label className="mb-2 block text-xs font-black text-white/70">방송 제목</label>
              <input
                value={title}
                maxLength={100}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="예) 오늘 랭크 올리기 도전!"
                className="w-full rounded-xl border border-border bg-bg-3 px-3 py-3 text-sm outline-none placeholder:text-white/25 focus:border-accent/40"
              />
              <div className="mt-1 text-right text-[10px] text-white/25">{title.length}/100</div>
            </div>

            {/* 카테고리 */}
            <div>
              <label className="mb-2 block text-xs font-black text-white/70">카테고리</label>
              <div className="flex flex-wrap gap-2">
                {SELECTABLE_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cx(
                      'rounded-full border px-3 py-1.5 text-xs font-black transition',
                      category === c
                        ? 'border-accent bg-accent text-black'
                        : 'border-border text-white/45 hover:text-white',
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cx(
                'w-full rounded-xl py-3 text-sm font-black transition',
                canSubmit ? 'bg-accent text-black hover:opacity-90' : 'bg-bg-4 text-white/30',
              )}
            >
              {submitting ? '방송 시작 중…' : '방송 시작하기'}
            </button>
          </div>
        </div>
      </main>
      <ToastHost />
    </div>
  )
}
