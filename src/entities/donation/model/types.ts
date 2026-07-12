export interface DonationPayload {
  amount: number
  message: string
}

// POST /donations 요청 (백엔드 DonationApi.DonationRequest)
// ID 는 Snowflake(64bit)라 JS number 정밀도 초과 방지 위해 string 으로 전송 → 백엔드가 Long 으로 역직렬화
export interface CreateDonationRequest {
  streamId: string
  receiverId: string
  amount: number
  message?: string
  senderNickname?: string // TODO(auth): 인증 붙으면 제거(토큰에서)
}

export interface CreateDonationResponse {
  donationId: number | null
}