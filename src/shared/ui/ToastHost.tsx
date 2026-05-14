import { useToastStore } from '../model/toastStore'

const tone = {
  info: 'border-accent/30 text-accent',
  success: 'border-accent-green/30 text-accent-green',
  error: 'border-accent-2/30 text-accent-2',
}

export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts)
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={`rounded-xl border bg-bg-3 px-4 py-3 text-sm font-bold shadow-2xl animate-slide-up ${tone[toast.type] || tone.info}`}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
