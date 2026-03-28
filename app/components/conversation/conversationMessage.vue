<template>
  <!-- 单个聊天消息容器 -->
  <div class="dialog" :class="messageClass">
    <!-- 消息内容区域 -->
    <span class="content" :class="contentClass">
      <!-- 加载状态 → 显示加载动画/文字；非加载 → 显示内容 -->
      <span v-if="loading === true">加载中...</span>
      <span v-else>{{ content }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { conversationMessagePropsType } from '~/types/conversation/conversationMessagesType'

const props = defineProps<conversationMessagePropsType>()


/**
 * 计算属性：动态样式类
 * 对应原代码的 sender 判断逻辑
 */
const messageClass = computed(() => {
  return props.sender === 'user' ? 'dialog-user' : 'dialog-AI'
})

const contentClass = computed(() => {
  return props.sender === 'user' ? 'content-user' : 'content-AI'
})
</script>

<!-- 完整整合你提供的微信风格样式 scoped样式隔离 -->
<style scoped lang="scss">
.dialog {
  padding: 10px 0; /* 调整上下间距，去掉左右padding */
  display: flex;
  max-width: 100%;
  height: auto;
  align-items: flex-end; /* 聊天气泡底部对齐（更符合微信风格） */

  .content {
    display: inline-block;
    background-color: #efefefaa;
    border-radius: 12px; /* 替换$radius-lg为固定值，避免变量依赖 */
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
</style>
