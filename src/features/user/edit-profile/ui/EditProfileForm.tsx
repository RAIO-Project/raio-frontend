import { useState } from 'react'

import { useUserStore } from '@/features/user'
import { showToast } from '@/shared'

const ROLE_LABEL: Record<string, string> = {
  USER: '일반',
  ADMIN: '관리자',
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400',
  SUSPENDED: 'bg-yellow-500/20 text-yellow-400',
  REMOVED: 'bg-red-500/20 text-red-400',
}

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '정상',
  SUSPENDED: '정지',
  REMOVED: '탈퇴',
}

function formatLastLogin(lastLoginAt: string | null) {
  if (!lastLoginAt) return '정보 없음'
  return new Date(lastLoginAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EditProfileForm() {
  const user = useUserStore((state) => state.user)
  const token = useUserStore((state) => state.token)
  const refreshToken = useUserStore((state) => state.refreshToken)
  const setSession = useUserStore((state) => state.setSession)

  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [saving, setSaving] = useState(false)

  const initial = ((user?.nickname || user?.email || '?')[0] ?? '?').toUpperCase()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !token || !refreshToken) return
    if (!nickname.trim()) {
      showToast('닉네임을 입력해주세요.', 'error')
      return
    }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 300)) // 낙관적 딜레이
    setSession({ ...user, nickname: nickname.trim() }, token, refreshToken)
    showToast('프로필이 저장되었습니다.', 'success')
    setSaving(false)
  }

  if (!user) return null

  return (
    <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-bg-2">
      {/* 배너 */}
      <div className="relative h-28 bg-gradient-to-br from-accent/40 via-cyan-600/20 to-bg-2">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.04),transparent_60%)]" />
      </div>

      {/* 아바타 + 기본 정보 */}
      <div className="relative px-6 pb-6">
        {/* 아바타 */}
        <div className="absolute -top-10 left-6 flex h-20 w-20 items-center justify-center rounded-[1.4rem] border-4 border-bg-2 bg-gradient-to-br from-accent to-cyan-500 text-2xl font-black text-black shadow-xl">
          {initial}
        </div>

        {/* 상태 배지 */}
        <div className="flex justify-end pt-3">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_COLOR[user.status] ?? STATUS_COLOR['ACTIVE']}`}
          >
            {STATUS_LABEL[user.status] ?? '정상'}
          </span>
        </div>

        {/* 닉네임 & 이메일 */}
        <div className="mt-6">
          <h2 className="text-2xl font-black text-white">{user.nickname || '닉네임 없음'}</h2>
          <p className="mt-0.5 text-sm text-white/40">{user.email}</p>
        </div>

        {/* 메타 정보 */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-white/35">
          <span>
            역할{' '}
            <strong className="text-white/60">{ROLE_LABEL[user.role] ?? user.role}</strong>
          </span>
          {user.phoneNumber && (
            <span>
              연락처 <strong className="text-white/60">{user.phoneNumber}</strong>
            </span>
          )}
          <span>
            마지막 로그인{' '}
            <strong className="text-white/60">{formatLastLogin(user.lastLoginAt)}</strong>
          </span>
        </div>

        {/* 구분선 */}
        <div className="my-5 border-t border-white/8" />

        {/* 편집 폼 */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-bold text-white/40">닉네임</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            placeholder="닉네임을 입력하세요"
            className="w-full rounded-2xl border border-white/10 bg-bg-3 px-4 py-3 text-sm outline-none placeholder:text-white/20 focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/20">{nickname.length} / 20</span>
            <button
              type="submit"
              disabled={saving || nickname.trim() === user.nickname}
              className="rounded-2xl bg-accent px-5 py-2.5 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-40"
            >
              {saving ? '저장 중…' : '저장하기'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
