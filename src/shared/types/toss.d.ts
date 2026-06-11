interface TossWidgets {
  setAmount(params: { value: number; currency: 'KRW' | 'USD' }): Promise<void>
  renderPaymentMethods(params: { selector: string; variantKey: string }): Promise<unknown>
  renderAgreement(params: { selector: string; variantKey: string }): Promise<unknown>
  requestPayment(params: {
    orderId: string
    orderName: string
    successUrl: string
    failUrl: string
    customerName?: string
    customerEmail?: string
    customerMobilePhone?: string
  }): Promise<void>
}

interface TossPaymentRequest {
  requestPayment(options: {
    method: 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'MOBILE_PHONE' | 'CULTURE_GIFT_CERTIFICATE' | 'BOOK_GIFT_CERTIFICATE' | 'GAME_GIFT_CERTIFICATE'
    amount: { value: number; currency: 'KRW' | 'USD' }
    orderId: string
    orderName: string
    successUrl: string
    failUrl: string
    customerName?: string
    customerEmail?: string
  }): Promise<void>
}

interface TossPaymentsInstance {
  payment(options: { customerKey: string }): TossPaymentRequest
  widgets(options: { customerKey: string }): TossWidgets
}

declare function TossPayments(clientKey: string): TossPaymentsInstance

interface Window {
  TossPayments: typeof TossPayments
}
