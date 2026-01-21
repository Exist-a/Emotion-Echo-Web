<template>
  <div class="conversationInput-container">
    <textarea
      class="conversation-textarea"
      v-model="message"
      :style="{ fontSize: userConfig.fontSize }"
      placeholder="请输入想倾诉的内容，按发送按钮提交..."
      @input="autoResizeTextarea"
    ></textarea>
    <div class="actions">
      <div class="left">
        <el-button 
          :icon="Paperclip" 
          circle 
          size="small"
          class="action-btn"
        />
      </div>
      <div class="right">
        <el-button 
          :icon="Microphone" 
          size="small"
          class="action-btn voice-btn"
        />
        <el-divider
          direction="vertical"
          border-style="dashed"
          class="vertical-divider"
        />
        <el-button
          circle
          :icon="Promotion"
          type="primary"
          size="small"
          class="send-btn"
          @click="sendMessage"
          :disabled="!message.trim()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Promotion, Microphone, Paperclip } from "@element-plus/icons-vue";
const userStore = useUserStore();
const userConfig = ref(userStore.getUserConfig());
const message = ref("");
const route = useRoute();
const textareaRef = ref<HTMLTextAreaElement>(); // 新增：textarea引用

// 新增：输入框自动调整高度（适配内容多少）
const autoResizeTextarea = () => {
  if (!textareaRef.value) return;
  // 重置高度为最小高度，再根据内容撑开
  textareaRef.value.style.height = "auto";
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`; // 最大高度200px
};

// 页面加载时初始化高度
onMounted(() => {
  autoResizeTextarea();
});

const sendMessage = () => {
  if (!message.value.trim()) return;
  if (route.params.id) {
    // 代表在会话中发送信息
  } else {
    // 不会话中发送信息时，需要新建会话
  }
  message.value = "";
  // 发送后重置输入框高度
  nextTick(() => {
    autoResizeTextarea();
  });
};
</script>

<style lang="scss" scoped>
@mixin btn-effect {
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  &:active {
    transform: scale(0.98);
  }
}

.conversationInput-container {
  border-radius: $radius-xxl;
  border: 1px solid #e5e7eb;
  // background-color: #ffffff;
  width: clamp(300px, 80%, 1200px);
  margin: 20px auto;
  padding: 12px 16px;
  // box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s ease;
  // 核心：容器高度自适应，靠子元素撑开
  display: flex;
  flex-direction: column;

  &:has(.conversation-textarea:focus) {
    border-color: #409eff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
  }

  .conversation-textarea {
    resize: none;
    border: none;
    outline: none;
    width: 100%;
    // 关键修改：去掉固定vh高度，改用最小/最大高度
    min-height: 80px; // 发消息后回到最小高度，不会过小
    max-height: 200px; // 内容过多时限制最大高度，避免溢出
    padding: 8px 0;
    font-family: inherit;
    color: #333;
    line-height: 1.5;
    background-color: transparent;
    // 内容溢出时滚动，不撑破容器
    overflow-y: auto;

    &::placeholder {
      color: #9ca3af;
      font-size: 14px;
    }
  }

  .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // 关键：用margin-top替代padding-top，避免高度变化时间距异常
    margin-top: 12px;
    border-top: 1px solid #f3f4f6;
    padding-top: 10px;

    .left, .right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-btn {
      @include btn-effect;
      color: #6b7280;
      border-color: #e5e7eb;
      &:hover {
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #f0f9ff;
      }
    }

    .voice-btn {
      color: #9333ea;
      &:hover {
        border-color: #e9d5ff;
        background-color: #faf5ff;
      }
    }

    .vertical-divider {
      height: 24px !important;
      margin: 0 6px;
      border-color: #e5e7eb;
    }

    .send-btn {
      @include btn-effect;
      background-color: #409eff;
      border-color: #409eff;
      width: 36px;
      height: 36px;
      &:hover {
        background-color: #66b1ff;
        border-color: #66b1ff;
      }
      &:disabled {
        background-color: #a0cfff;
        border-color: #a0cfff;
        transform: none;
        box-shadow: none;
        cursor: not-allowed;
      }
    }
  }
}

// 移动端适配（同步调整高度逻辑）
@media (max-width: 768px) {
  .conversationInput-container {
    width: 95%;
    padding: 10px 12px;
    margin: 10px auto;
  }
  .conversation-textarea {
    min-height: 60px; // 移动端最小高度更小
    max-height: 150px;
  }
}
</style>