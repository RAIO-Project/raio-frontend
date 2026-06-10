import { httpClient } from '@/shared'

import type { CreateDonationRequest, CreateDonationResponse } from '../model/types'

/** 후원 생성 POST /donations. 성공 시 백엔드가 시청자에게 실시간(STOMP)으로 후원을 브로드캐스트한다. */
export async function createDonation(
  request: CreateDonationRequest,
): Promise<CreateDonationResponse> {
  const { data } = await httpClient.post<CreateDonationResponse>('/donations', request)
  return data
}