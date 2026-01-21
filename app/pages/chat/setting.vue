<template>
  <div class="setting-container">
    <div class="setting-item font-size-edit">
      <span :style="{ fontSize: userConfig.fontSize }" class="content"
        >测试字体</span
      >
      <div style="align-items: center;">
        <span class="setting-title">选择字体大小</span>
        <el-dropdown
          v-model="userConfig.fontSize"
          @command="handleFontSizeChange"
        >
          <span class="el-dropdown-link">
            {{ userConfig.fontSize }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item value="14px" command="14px"
                >14px</el-dropdown-item
              >
              <el-dropdown-item value="16px" command="16px"
                >16px</el-dropdown-item
              >
              <el-dropdown-item value="18px" command="18px"
                >18px</el-dropdown-item
              >
              <el-dropdown-item value="20px" command="20px"
                >20px</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import type { fontSizeType } from "~/types/userConfig/userConfigType";
const userStore = useUserStore();
const userConfig = ref(userStore.getUserConfig());
const handleFontSizeChange = (fontSize: fontSizeType) => {
  console.log("字体大小改变为:", fontSize);
  userConfig.value.fontSize = fontSize;
  userStore.setFontSize(fontSize);
};
</script>

<style scoped lang="scss">
.setting-container {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  box-sizing: border-box;

  .setting-item {
    display: flex;
    align-items: center;
    background-color: #f5f7fa;
    border-radius: 12px;
    padding: 10px;
    margin-bottom: 16px;
    transition: background-color 0.2s ease;

    // 鼠标悬浮轻微变色
    &:hover {
      background-color: #f0f2f5;
    }

    // 最后一个项去掉底部间距
    &:last-child {
      margin-bottom: 0;
    }
  }

  .font-size-edit {
    justify-content: space-between;
    flex-wrap: wrap; // 响应式换行，避免小屏幕溢出
    gap: 16px; // 弹性布局间距，替代margin

    .setting-title {
      font-size: 14px;
      color: #303133;
      font-weight: 500; // 轻微加粗，突出标题
      margin-right: 12px;
      white-space: nowrap; // 防止标题换行
    }

    .content {
      background-color: #07c160;
      color: #fff;
      // 统一圆角，更美观
      border-radius: 12px;
      display: inline-block;
      margin: 0; // 去掉默认margin，用父级gap控制
      padding: 10px 12px; // 优化内边距，更舒适
      line-height: 1.6; // 优化行高，提升可读性
      max-width: 60%; // 调整宽度，避免占比过大
      word-wrap: break-word;
      word-break: break-all;
      box-sizing: border-box;
      box-shadow: 0 2px 8px rgba(7, 193, 96, 0.2); // 轻微阴影，突出测试文本
    }

    // 下拉菜单触发区样式优化
    .el-dropdown-link {
      display: inline-flex;
      align-items: center;
      color: #409eff; // Element Plus 主色，突出可点击
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s ease;

      // 悬浮高亮
      &:hover {
        background-color: rgba(64, 158, 255, 0.1);
      }

      // 图标间距优化
      .el-icon {
        margin-left: 4px;
        font-size: 12px;
      }
    }
  }
}

// 响应式适配：小屏幕下测试文本占比提升
@media (max-width: 768px) {
  .setting-container .font-size-edit .content {
    max-width: 100%;
    margin-bottom: 8px;
  }
}
</style>
