export interface Wallet {
  point: number
  updatedAt: string
}

export interface PointHistory {
  id: string
  type: 'CHARGE' | 'DONATION' | 'REFUND'
  amount: number
  createdAt: string
  description: string
}
