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
  // senderNickname 은 보내지 않는다 — 후원자 표시명은 백엔드가 토큰에서 채운다
}

export interface CreateDonationResponse {
  donationId: number | null
}