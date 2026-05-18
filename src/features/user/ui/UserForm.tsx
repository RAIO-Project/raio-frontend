import type { ChangeEvent, FormEvent, InputHTMLAttributes } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { loginUser, registerUser } from '@/features/user'
import { useUserStore } from '@/features/user'
import { showToast } from '@/shared'

type UserFormMode = 'login' | 'register'

interface UserFormProps {
  mode: UserFormMode
}

interface UserFormState {
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  phoneNumber: string
}

const initialForm: UserFormState = {
  email: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
  phoneNumber: '',
}

export function UserForm({ mode }: UserFormProps) {
  const isRegister = mode === 'register'
  const navigate = useNavigate()
  const setSession = useUserStore((state) => state.setSession)
  const [form, setForm] = useState<UserFormState>(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (key: keyof UserFormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const validate = (): string => {
    if (!form.email.trim() || !form.password.trim()) return '이메일과 비밀번호를 입력해주세요.'
    if (isRegister && !form.nickname.trim()) return '닉네임을 입력해주세요.'
    if (isRegister && form.password.length < 8) return '비밀번호는 8자 이상이어야 합니다.'
    if (isRegister && form.password !== form.passwordConfirm) return '비밀번호 확인이 일치하지 않습니다.'
    return ''
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = validate()
    if (message) {
      setError(message)
      return
    }

    setError('')
    setLoading(true)
    try {
      const result = isRegister
        ? await registerUser({
            email: form.email.trim(),
            password: form.password,
            nickname: form.nickname.trim(),
            phoneNumber: form.phoneNumber.trim(),
          })
        : await loginUser({ email: form.email.trim(), password: form.password })
      setSession(result.user, result.accessToken, result.refreshToken)
      showToast(isRegister ? '회원가입이 완료되었습니다.' : '로그인되었습니다.', 'success')
      navigate('/')
    } catch {
      setError(isRegister ? '이미 가입된 이메일이거나 입력값이 올바르지 않습니다.' : '이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-border bg-bg-2/90 p-7 shadow-2xl backdrop-blur">
      <div className="mb-7 text-center">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-accent">RAIO LIVE</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{isRegister ? '방송을 시작할 계정 만들기' : '라이브에 입장하기'}</h1>
        <p className="mt-2 text-xs text-white/40">채팅, 팔로우, 후원까지 하나의 계정으로 이용합니다.</p>
      </div>

      {error && <div className="mb-4 rounded-xl border border-accent-2/30 bg-accent-2/10 px-4 py-3 text-xs font-bold text-accent-2">{error}</div>}

      <form onSubmit={submit} className="space-y-4">
        <Field label="이메일" value={form.email} onChange={update('email')} type="email" placeholder="example@raio.tv" autoComplete="email" />
        {isRegister && <Field label="닉네임" value={form.nickname} onChange={update('nickname')} placeholder="방송/채팅에서 보일 이름" autoComplete="nickname" />}
        {isRegister && <Field label="휴대폰 번호" value={form.phoneNumber} onChange={update('phoneNumber')} placeholder="010-0000-0000" autoComplete="tel" />}
        <Field label="비밀번호" value={form.password} onChange={update('password')} type="password" placeholder="8자 이상" autoComplete={isRegister ? 'new-password' : 'current-password'} />
        {isRegister && <Field label="비밀번호 확인" value={form.passwordConfirm} onChange={update('passwordConfirm')} type="password" placeholder="비밀번호 재입력" autoComplete="new-password" />}

        <button disabled={loading} className="w-full rounded-2xl bg-accent px-4 py-3.5 text-sm font-black text-black transition hover:opacity-90 disabled:opacity-50">
          {loading ? '처리 중...' : isRegister ? '회원가입' : '로그인'}
        </button>
      </form>

      <p className="mt-5 text-center text-xs text-white/35">
        {isRegister ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}{' '}
        <Link className="font-black text-accent hover:underline" to={isRegister ? '/login' : '/register'}>
          {isRegister ? '로그인' : '회원가입'}
        </Link>
      </p>
    </div>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

function Field({ label, ...props }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.22em] text-white/40">{label}</span>
      <input {...props} className="w-full rounded-xl border border-border bg-bg-3 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-accent/50" />
    </label>
  )
}
