<template>
  <main class="main">
    <div
      class="dialog"
      :class="item.sender === 'user' ? 'dialog-user' : 'dialog-AI'"
      v-for="item in data"
    >
      <span
        class="content"
        :class="item.sender === 'user' ? 'content-user' : 'content-AI'"
        >{{ item.content }}</span
      >
    </div>
  </main>
  <conversationInput class="input"></conversationInput>
</template>

<script setup lang="ts">
import type { conversationMessagesType } from "~/types/conversation/conversationMessagesType";

const conversationStore = useConversationStore();
const route = useRoute();
const data = ref<conversationMessagesType>([]);
onMounted(() => {
  if (!route.params.id) {
    ElNotification({
      type: "error",
      message: "获取会话错误",
    });
    return;
  }
  const id = route.params.id as string;
  data.value = conversationStore.getConversationById(+id);
});
</script>

<style scoped lang="scss">
.main {
  width: 80%;
  margin: 0 auto;
  height: calc(100% - 220.5px);
  overflow-y: scroll;
  .dialog {
    padding: 10px;
    display: flex; // 核心flex布局
    max-width: 100%;
    // 关键修复：删除固定10vh高度（导致对齐无感知），改为自适应
    height: auto;
    // 微信聊天气泡垂直居中（替代end，更符合实际体验）
    align-items: center;
    .content {
      display: inline-block;
      background-color: #efefefaa;
      border-radius: $radius-lg;
      padding: 8px 12px;
      line-height: 1.5;
      max-width: 70%;
      word-wrap: break-word;
      word-break: break-all;
      box-sizing: border-box;
    }
  }
  .dialog-user {
    // 右对齐核心（保留）
    justify-content: flex-end;
    margin-bottom: 20px;
    .content-user {
      background-color: #07c160;
      color: #fff;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 4px;
    }
  }
  .dialog-AI {
    // 左对齐核心（补充，显式声明）
    justify-content: flex-start;
    margin-bottom: 20px;
    .content-AI {
      background-color: #f0f0f0;
      color: #333;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      border-bottom-right-radius: 12px;
      border-bottom-left-radius: 4px;
    }
  }
}
.input {
  margin: 10px auto;
}
</style>
