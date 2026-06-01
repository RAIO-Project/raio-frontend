import { useNavigate, useParams } from 'react-router-dom'

import { ToastHost } from '@/shared'
import { AppHeader } from '@/widgets/layout'
import { AuthGateModal, PointChargeModal } from '@/widgets/payment/point-charge'

/**
 * TODO: 단건 상세 연동 (다음 작업)
 *  - GET /streams/{streamId} (StreamReadByIdUseCase) 연동
 *  - LiveRoom 을 StreamDetail 응답 기준으로 재구성 (mock 전용 필드 streamerName/followers/tags/notice 정리)
 *  - useChat(streamId) 의 id 타입 number -> string 정합성 처리
 *  현재는 목록 연동만 완료된 상태라 상세는 플레이스홀더로 둔다.
 */
export function StreamDetailPage() {
  const { streamId } = useParams()
  const navigate = useNavigate()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-bg">
      <AppHeader />
      <div className="border-b border-border bg-bg-2 px-4 py-2 text-xs text-white/40">
        <button onClick={() => navigate('/')} className="hover:text-white">
          ← 홈
        </button>
        <span className="mx-2">/</span>
        <span className="text-white/70">방송 {streamId}</span>
      </div>
      <div className="flex flex-1 items-center justify-center text-sm text-white/40">
        상세 페이지 준비 중입니다.
      </div>
      <AuthGateModal />
      <PointChargeModal />
      <ToastHost />
    </div>
  )
}
