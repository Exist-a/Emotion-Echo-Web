<template>
  <!-- 核心：最外层改为flex垂直布局，占满100%高度 -->
  <div class="chat-page-container" :class="$device.isMobile?'chat-page-container-mobile':''">
    <main class="main">
      <div
        class="dialog"
        :class="item.sender === 'user' ? 'dialog-user' : 'dialog-AI'"
        v-for="item in data"
        :key="item.id" 
      >
        <span
          class="content"
          :class="item.sender === 'user' ? 'content-user' : 'content-AI'"
          :style="{ fontSize: userConfig.fontSize }"
          >{{ item.content }}</span
        >
      </div>
    </main>
    <!-- 输入框容器：固定在底部，宽度适配 -->
    <div class="input-wrapper">
      <conversationInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { conversationMessagesType } from "~/types/conversation/conversationMessagesType";
const userStore = useUserStore();
const userConfig = ref(userStore.getUserConfig());
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
// 最外层容器：垂直flex，占满100%高度，防止滚动条溢出
.chat-page-container {
  width: 100%;
  height: calc(100vh - 25px); // 用vh替代100%，确保占满视口高度
  display: flex;
  flex-direction: column; // 垂直布局：main在上，输入框在下
  overflow: hidden; // 防止整体溢出
  padding: 0 10px;
  box-sizing: border-box;
}
.chat-page-container-mobile{
  height: calc(100vh - 25px - 65px); // 用vh替代100%，确保占满视口高度

}
.main {
  flex: 1; // 核心：自动占满输入框以外的剩余高度
  width: 80%;
  margin: 0 auto;
  overflow-y: auto; // 内容过多时滚动，不撑破容器
  padding: 10px 0 20px; // 底部留间距，避免被输入框遮挡
  // 美化滚动条（可选）
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e5e7eb;
    border-radius: 3px;
  }

  .dialog {
    padding: 10px 0; // 调整上下间距，去掉左右padding
    display: flex;
    max-width: 100%;
    height: auto;
    align-items: flex-end; // 聊天气泡底部对齐（更符合微信风格）

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
    justify-content: flex-end;
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
    justify-content: flex-start;
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

// 输入框外层容器：固定在底部，宽度适配
.input-wrapper {
  // position: fixed;
  width: 100%;
  padding: 10px 0;
  // left: 200px;
  // background-color: #fff; // 背景色覆盖，避免穿透聊天内容
  // 顶部加阴影，区分聊天区和输入区
  // box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  // 核心：输入框组件居中，宽度继承
  display: flex;
  justify-content: center;
  align-items: center;
}

// 移动端适配
@media (max-width: 768px) {
  .main {
    width: 95%; // 移动端占满宽度
    padding-bottom: 15px;
  }
  .chat-page-container {
    padding: 0 5px;
  }
  .dialog .content {
    max-width: 80%; // 移动端气泡更宽
  }
}
</style>