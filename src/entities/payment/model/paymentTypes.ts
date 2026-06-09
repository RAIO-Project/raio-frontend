export interface Wallet {
  id: string
  userId: string
  balance: number
  createdAt: string
  updatedAt: string
}

export interface WalletResponse {
  wallet: Wallet
}

export interface PreparePaymentRequest {
  userId: string
  amount: number
  method: 'CARD' | 'VIRTUAL_ACCOUNT' | 'EASY_PAY' | 'TRANSFER' | 'MOBILE_PHONE'
  pgProvider: 'TOSS' | 'NAVER' | 'KAKAO' | 'INICIS'
}

export interface PreparePaymentResponse {
  paymentId: string
  orderId: string
  amount: number
}

export interface ConfirmPaymentRequest {
  paymentId: string
  paymentKey: string
  orderId: string
  amount: number
}

export interface ConfirmPaymentResponse {
  paymentId: string
  orderId: string
  status: string
}

export interface PointHistorySummary {
  id: string
  type: 'CHARGE' | 'PAYMENT' | 'REFUND'
  amount: number
  balanceSnapshot: number
  createdAt: string
}

export interface PointHistoriesResponse {
  pointHistories: {
    content: PointHistorySummary[]
    totalElements: number
    number: number
    size: number
  }
}
