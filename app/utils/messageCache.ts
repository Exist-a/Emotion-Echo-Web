// utils/messageCache.ts
import type {
  StoredMessage,
  conversationMessageType,
} from "~/types/conversation/conversationMessagesType";
import { db } from "./db";
import Dexie from "dexie";

// 保存单条消息（自动关联当前会话）
export async function saveMessage(
  sessionId: string,
  message: conversationMessageType,
): Promise<void> {
  const stored: StoredMessage = { ...message, sessionId };
  await db.messages.put(stored); // put 会覆盖已存在的主键
}

// 批量保存消息
export async function saveMessages(
  sessionId: string,
  messages: conversationMessageType[],
): Promise<void> {
  const stored = messages.map((msg) => ({ ...msg, sessionId }));
  await db.messages.bulkPut(stored);
}

// 根据会话ID分页查询历史消息（按 sendTime 倒序，最新的在前）
export async function getMessagesBySession(
  sessionId: string,
  pageSize: number,
  beforeSendTime?: number, // 游标：获取比此时间戳更早的消息
): Promise<StoredMessage[]> {
  let query = db.messages
    .where("[sessionId+sendTime]")
    .between(
      [sessionId, Dexie.minKey],
      [sessionId, beforeSendTime ?? Dexie.maxKey],
    );

  // 按 sendTime 降序排列，取 pageSize 条
  const messages = await query
    .reverse() // 倒序
    .limit(pageSize)
    .toArray();

  return messages;
}

// 获取某个会话的最新 N 条消息（用于恢复当前会话）
export async function getLatestMessages(
  sessionId: string,
  limit = 50,
): Promise<StoredMessage[]> {
  return db.messages
    .where("sessionId")
    .equals(sessionId)
    .reverse() // 按 sendTime 降序
    .limit(limit)
    .toArray();
}

// 清空某个会话的所有缓存
export async function clearSessionMessages(sessionId: string): Promise<void> {
  await db.messages.where("sessionId").equals(sessionId).delete();
}

// 缓存淘汰策略：每个会话最多保留 maxCount 条消息（保留最新的）
export async function trimSessionMessages(
  sessionId: string,
  maxCount = 500,
): Promise<void> {
  const count = await db.messages.where("sessionId").equals(sessionId).count();

  if (count > maxCount) {
    // 获取需要删除的最旧消息：使用复合索引正向查询（按 sendTime 升序）
    const toDelete = await db.messages
      .where("[sessionId+sendTime]")
      .between([sessionId, Dexie.minKey], [sessionId, Dexie.maxKey])
      .limit(count - maxCount) // 取最旧的 N 条
      .toArray();

    const idsToDelete = toDelete.map((msg) => msg.id);
    await db.messages.bulkDelete(idsToDelete);
  }
}
