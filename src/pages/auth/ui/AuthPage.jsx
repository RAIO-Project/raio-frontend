import { AuthPanel } from '../../../features/auth/ui/AuthPanel'
import { ToastHost } from '../../../shared/ui/ToastHost'

export function AuthPage({ mode }) {
  return (
    <div className="min-h-screen bg-bg px-4 py-10 text-white" style={{ background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(0,229,255,0.09), transparent 70%), #08090d' }}>
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center"><AuthPanel mode={mode} /></div>
      <ToastHost />
    </div>
  )
}
