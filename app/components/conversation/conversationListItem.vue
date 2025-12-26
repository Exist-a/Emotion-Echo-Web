<template>
  <div class="listItem-container">
    <p class="label">{{ label }}</p>
    <div v-for="item in data" :key="item.id">
      <el-input
        v-if="isEditName && currentEditId === item.id"
        placeholder="请输入会话名称"
        class="edit-input"
        v-model="tempTitle"
        @keyup.enter="submitNewTitle(item.id, label)"
      />
      <div
        v-else
        class="list-item"
        @click="openOldConversation($event, item.id)"
      >
        <p>{{ item.title }}</p>

        <el-dropdown placement="bottom-start">
          <el-button
            :icon="More"
            :circle="true"
            style="outline: none; border: none"
          >
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                :icon="CaretTop"
                @click="handleConversationTop(label, item.id)"
                v-if="!item.isTop"
                >置顶</el-dropdown-item
              >
              <el-dropdown-item
                :icon="CaretBottom"
                @click="handleConversationTop(label, item.id)"
                v-else
                >取消置顶</el-dropdown-item
              >
              <el-dropdown-item
                :icon="Close"
                @click="handleDelConversation(label, item.id)"
                >删除</el-dropdown-item
              >
              <!-- 4. 传递当前item给重命名方法 -->
              <el-dropdown-item :icon="EditPen" @click="handleEditName(item)"
                >重命名</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  conversationListItemType,
  conversationListLabelType,
} from "~/types/conversation/conversationListType";
import {
  More,
  CaretTop,
  Close,
  EditPen,
  CaretBottom,
} from "@element-plus/icons-vue";

const props = defineProps<conversationListItemType>();
const conversationStore = useConversationStore();
const isEditName = ref<boolean>(false);

// 标记当前编辑的item ID（避免所有项都显示输入框）
const currentEditId = ref<number | null>(null);
// 临时存储输入的标题
const tempTitle = ref("");
// 定义自定义事件，向父组件传递修改参数
const emit = defineEmits<{
  (
    e: "update-title",
    newTitle: string,
    id: number,
    label: conversationListLabelType
  ): void;
  (
    e: "update-delConversation",
    id: number,
    label: conversationListLabelType
  ): void;
}>();

//置顶按钮
const handleConversationTop = (
  label: conversationListLabelType,
  id: number
) => {
  conversationStore.handleConversationTop(label, id);
};

//重命名：初始化临时值和编辑状态
const handleEditName = (item: any) => {
  isEditName.value = true;
  currentEditId.value = item.id;
  tempTitle.value = item.title; // 初始化临时输入值
};

//提交新标题
const submitNewTitle = (id: number, label: conversationListLabelType) => {
  if (!tempTitle.value.trim()) {
    ElNotification({
      type: "error",
      title: "修改失败",
      message: "标题不能为空",
    });
    return;
  } // 空值校验
  emit("update-title", tempTitle.value, id, label); // 触发事件

  // 重置编辑状态
  isEditName.value = false;
  currentEditId.value = null;
};
//删除逻辑
const handleDelConversation = (
  label: conversationListLabelType,
  id: number
) => {
  ElMessageBox.confirm("删除后将不可恢复!", "删除会话", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(() => {
    emit("update-delConversation", id, label); // 触发事件
  });
};
const parentOpenOldConversation: (id: number) => void = inject(
  "openOldConversation"
)!;
const openOldConversation = (e: MouseEvent, id: number) => {
  const targetHtml = e.target as HTMLElement;
  if (!targetHtml) {
    return;
  }
  if (targetHtml.closest(".el-button")) {
    return;
  }
  parentOpenOldConversation(id);
};
</script>

<style scoped lang="scss">
.listItem-container {
  .label {
    color: $font-color-light;
    font-size: 14px;
    margin-bottom: 10px;
    white-space: nowarp;
  }
  .edit-input {
    // padding: 5px 10px;
    margin-bottom: 10px;
    height: 42px;
    width: 100%;
  }
  .list-item:hover {
    box-shadow: $box-shadow;
    transform: translateY(-2px);
  }
  .list-item {
    cursor: pointer;
    transition: all 0.5s ease;
    background-color: #fff;
    border-radius: $radius-lg;
    margin-bottom: 10px;
    padding: 5px 10px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    height: 42px;
    p {
      flex: 1;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
