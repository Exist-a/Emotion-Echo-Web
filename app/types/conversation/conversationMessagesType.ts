export type conversationMessagesType = conversationMessageType[];

export interface conversationMessageType {
  id: number;
  sender: "user" | "AI";
  sendTime: number;
  content: string | null;
  contentType: "text" | "audio" | "img";
}

//数据库存储所需
export interface StoredMessage extends conversationMessageType {
  sessionId: string;        // 所属会话ID
}