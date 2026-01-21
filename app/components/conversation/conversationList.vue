<template>
  <div class="header-fold" :class="$device.isMobile?'header-fold-mobile':''">
    <h3>情绪回音</h3>
    <el-button :icon="Memo" @click="foldAndUnfoldMenu" size="small"></el-button>
  </div>
  <div
    class="list-container"
    ref="menuRef"
    :class="{ 'list-container-fold': isMenuFolded }"
  >
    <div class="header">
      <h3>情绪回音</h3>
      <el-button :icon="Memo" @click="foldAndUnfoldMenu"></el-button>
    </div>
    <el-button
      type="primary"
      class="new-conversation-btn"
      :icon="ChatSquare"
      @click="startNewConversation"
      >新对话</el-button
    >
    <el-divider border-style="dashed" />
    <el-skeleton :rows="8" animated v-if="isListLoading && !labelHistoryList" />
    <el-empty
      description="暂无历史数据"
      v-else-if="!isListLoading && !labelHistoryList"
    />
    <div class="history-conversation" v-else>
      <!-- 根据时间排序，显示今天，一周内，三十天内，更早 -->
      <!-- 新增：监听子组件的update-title事件 -->
      <conversationListItem
        :label="value.label"
        :data="value.data"
        v-for="value in labelHistoryList"
        @update-title="handleUpdateTitle"
        @update-delConversation="handleDelConversation"
      ></conversationListItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatSquare, Memo } from "@element-plus/icons-vue";
import type {
  conversationListItemDataType,
  conversationListItemType,
  conversationListLabelType,
} from "~/types/conversation/conversationListType";
const conversationStore = useConversationStore();
// 定义响应式变量控制折叠状态
const isMenuFolded = ref(false);
const labelHistoryList = ref<conversationListItemType[] | null>(null);
const isListLoading = ref<boolean>(true);
const emit = defineEmits(["startNewConversation"]);
onMounted(() => {
  //从store获取数据
  labelHistoryList.value = conversationStore.getLabelHistoryList();
  isListLoading.value = false;
  //请求历史数据
});

// 切换折叠/展开状态
const foldAndUnfoldMenu = () => {
  isMenuFolded.value = !isMenuFolded.value;
};

const handleUpdateTitle = (
  newTitle: string,
  id: number,
  label: conversationListLabelType,
) => {
  conversationStore.handleEditTitle(newTitle, label, id);
};
const handleDelConversation = (
  id: number,
  label: conversationListLabelType,
) => {
  conversationStore.handleDelConversation(id, label);
};
const startNewConversation = () => {
  emit("startNewConversation");
};
</script>

<style scoped lang="scss">
@use "sass:color";
.header-fold {
  position: fixed;
  display: flex;
  padding: 10px;
  border-radius: $radius-lg;
  justify-content: space-between;
  align-items: center;
  width: 140px;
  background-color: color.adjust($bg-color, $alpha: -0.3);
  top: 30px;
  left: 170px;
  z-index: 1;
  color: $font-color-light;
  font-size: 12px;
}
.header-fold-mobile {
  top: 89px;
  left: 30px;
}
.list-container {
  z-index: 2;
  transition: all 0.5s ease-in-out; /* 可调整过渡时长，更丝滑 */
  background-color: $bg-color;
  border-radius: $radius-lg;
  padding: 20px;
  width: 16vw;
  box-shadow: $box-shadow;
  overflow: hidden; /* 关键：宽度为0时隐藏内部元素，且无法交互 */
  flex-shrink: 0; /* 防止被父元素挤压宽度 */
  min-width: 180px;
  .header {
    align-items: center;
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;

    h3 {
      color: $font-color-light;
      white-space: nowrap;
    }
  }

  .new-conversation-btn {
    width: 100%;
    height: 40px;
  }
}

// 折叠状态样式（去掉opacity，仅控制宽度和内边距）
.list-container-fold {
  width: 0;
  padding: 20px 0;
  min-width: 0;
}
</style>
