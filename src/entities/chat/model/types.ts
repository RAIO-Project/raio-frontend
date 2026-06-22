export type ChatMessageType = 'notice' | 'donation' | 'chat'
export type ChatRole = 'admin' | 'donor' | 'me' | 'normal'

export interface ChatMessage {
  id: number
  type: ChatMessageType
  role?: ChatRole
  senderNickname?: string
  amount?: number
  text: string
  chatId?: string
  blinded?: boolean
}
