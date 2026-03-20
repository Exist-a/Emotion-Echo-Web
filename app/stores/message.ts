import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { conversationMessagesType, conversationMessageType } from "~/types/conversation/conversationMessagesType";
import type { StoredMessage } from "~/types/conversation/conversationMessagesType";
// 引入缓存工具函数
import {
  saveMessage,
  saveMessages,
  getMessagesBySession,
  getLatestMessages,
  trimSessionMessages,
  clearSessionMessages,
} from "~/utils/messageCache";

export const useMessageStore = defineStore("message", () => {
  // 1. 核心状态
  const currentSessionId = ref<string | null>(null); // 当前会话ID（统一为string）
  const currentMessages = ref<StoredMessage[]>([]); // 当前会话的消息列表（响应式）
  const isLoading = ref(false); // 加载状态
  const hasMore = ref(true); // 是否还有更多历史消息可加载

  // 2. 计算属性：当前会话消息（按时间正序展示）
  const sortedCurrentMessages = computed(() => {
    return [...currentMessages.value].sort((a, b) => a.sendTime - b.sendTime);
  });

  // 3. 核心方法：切换会话（加载该会话的消息）
  const switchSession = async (sessionId: string) => {
    if (currentSessionId.value === sessionId) return;

    // 重置状态
    currentSessionId.value = sessionId;
    currentMessages.value = [];
    isLoading.value = true;
    hasMore.value = true;

    try {
      // 优先加载本地缓存的最新50条消息（可配置）
      const cachedMessages = await getLatestMessages(sessionId, 50);
      if (cachedMessages.length > 0) {
        currentMessages.value = cachedMessages;
        // 触发缓存淘汰（添加/加载消息后自动触发，合理时机）
        await trimSessionMessages(sessionId, 500);
      } else {
        // 缓存无数据：请求后端（留空，你后续对接）
        // const backendMessages = await fetchMessagesFromBackend(sessionId);
        // if (backendMessages.length > 0) {
        //   await saveMessages(sessionId, backendMessages);
        //   currentMessages.value = backendMessages;
        // }
        hasMore.value = false; // 无缓存且后端暂未对接，标记无更多
      }
    } catch (e) {
      console.warn("加载会话消息失败", e);
    } finally {
      isLoading.value = false;
    }
  };

  // 4. 加载更早的历史消息（分页加载）
  const loadMoreMessages = async (pageSize = 20) => {
    if (!currentSessionId.value || isLoading.value || !hasMore.value) return;

    isLoading.value = true;
    try {
      // 获取当前列表中最早的消息时间戳（作为游标）
      const earliestTime = currentMessages.value.length > 0
        ? Math.min(...currentMessages.value.map(msg => msg.sendTime))
        : undefined;

      // 从缓存加载更早的消息
      const moreMessages = await getMessagesBySession(
        currentSessionId.value,
        pageSize,
        earliestTime
      );

      if (moreMessages.length > 0) {
        currentMessages.value = [...currentMessages.value, ...moreMessages];
        // 触发缓存淘汰
        await trimSessionMessages(currentSessionId.value, 500);
      } else {
        // 无更多消息（缓存中已加载完）
        hasMore.value = false;
        // 可选：请求后端更早的消息（留空）
        // const backendMoreMessages = await fetchMoreMessagesFromBackend(
        //   currentSessionId.value,
        //   earliestTime,
        //   pageSize
        // );
      }
    } catch (e) {
      console.warn("加载更多消息失败", e);
    } finally {
      isLoading.value = false;
    }
  };

  // 5. 添加单条消息（发送/接收后调用）
  const addMessage = async (message: conversationMessageType) => {
    if (!currentSessionId.value) return;

    try {
      // 保存到缓存
      await saveMessage(currentSessionId.value, message);
      // 更新响应式列表
      currentMessages.value = [message as StoredMessage, ...currentMessages.value];
      // 触发缓存淘汰（添加新消息后是合理时机）
      await trimSessionMessages(currentSessionId.value, 500);
    } catch (e) {
      console.warn("保存消息失败", e);
    }
  };

  // 6. 批量添加消息（如后端批量返回历史消息）
  const batchAddMessages = async (messages: conversationMessagesType) => {
    if (!currentSessionId.value || messages.length === 0) return;

    try {
      await saveMessages(currentSessionId.value, messages);
      currentMessages.value = [...messages as StoredMessage[], ...currentMessages.value];
      await trimSessionMessages(currentSessionId.value, 500);
    } catch (e) {
      console.warn("批量保存消息失败", e);
    }
  };

  // 7. 清空当前会话的消息（手动清空时调用）
  const clearCurrentSessionMessages = async () => {
    if (!currentSessionId.value) return;

    try {
      await clearSessionMessages(currentSessionId.value);
      currentMessages.value = [];
    } catch (e) {
      console.warn("清空会话消息失败", e);
    }
  };

  // 8. 原getConversationById迁移到这里（仅保留结构，后端逻辑留空）
  const getConversationById = async (sessionId: string) => {
    // 优先查本地缓存
    const cachedMessages = await getLatestMessages(sessionId, 50);
    if (cachedMessages.length > 0) {
      return cachedMessages;
    }

    // 缓存无数据：请求后端（留空，你后续对接）
    // const backendData = await fetch(`/api/conversation/${sessionId}`);
    // const messages = await backendData.json();
    // // 写入缓存
    // await saveMessages(sessionId, messages);
    // return messages;

    // 临时返回空数组（对接后端前）
    return [];
  };

  // 9. 重置messageStore状态（如退出登录）
  const reset = () => {
    currentSessionId.value = null;
    currentMessages.value = [];
    isLoading.value = false;
    hasMore.value = true;
  };

  return {
    // 状态
    currentSessionId,
    currentMessages,
    sortedCurrentMessages,
    isLoading,
    hasMore,
    // 方法
    switchSession,
    loadMoreMessages,
    addMessage,
    batchAddMessages,
    clearCurrentSessionMessages,
    getConversationById,
    reset,
  };
});