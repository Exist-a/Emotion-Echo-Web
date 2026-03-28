export type conversationMessagesType = conversationMessageType[]

export interface conversationMessageType {
  id: string
  sender: 'user' | 'AI'
  sendTime: number
  content: Ref | string | null
  contentType: 'text' | 'audio' | 'img'
  loading?: boolean|Ref
}

export interface conversationMessagePropsType extends conversationMessageType {
  loading?: boolean|Ref<boolean>
}

//数据库存储所需
export interface StoredMessage extends conversationMessageType {
  sessionId: string // 所属会话ID
}
