import { httpClient } from '@/shared'
import type {
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
  PointHistoriesResponse,
  PreparePaymentRequest,
  PreparePaymentResponse,
  Wallet,
  WalletResponse,
} from '../model/paymentTypes'

export async function getWallet(userId: string): Promise<Wallet> {
  const { data } = await httpClient.get<WalletResponse>(`/payment/wallets/${userId}`)
  return data.wallet
}

export async function createWallet(userId: string): Promise<Wallet> {
  const { data } = await httpClient.post<WalletResponse>('/payment/wallets', { userId })
  return data.wallet
}

export async function preparePayment(params: PreparePaymentRequest): Promise<PreparePaymentResponse> {
  const { data } = await httpClient.post<PreparePaymentResponse>('/payment/payments/prepare', params)
  return data
}

export async function confirmPayment(params: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> {
  const { data } = await httpClient.post<ConfirmPaymentResponse>('/payment/payments/confirm', params)
  return data
}

export async function getPointHistories(
  walletId: string,
  page = 0,
  size = 20,
): Promise<PointHistoriesResponse['pointHistories']> {
  const { data } = await httpClient.get<PointHistoriesResponse>(
    `/payment/point-histories/wallets/${walletId}`,
    { params: { page, size } },
  )
  return data.pointHistories
}
