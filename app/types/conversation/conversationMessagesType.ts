export type conversationMessagesType = conversationMessageType[];

export interface conversationMessageType {
  id: number;
  sender: "user" | "AI";
  sendTime: number;
  content: string | null;
  contentType: "text" | "audio" | "img";
}
