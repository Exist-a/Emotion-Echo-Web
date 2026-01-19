<template>
  <div class="question-container">
    <div class="bar">
      <el-button type="primary" @click="navigateTo({ name: 'chat-user' })"
        >返回用户页面</el-button
      >
    </div>
    <h1 class="title">心理测验量表</h1>
    <p class="description">我们将根据您的答题情况分析您的心理状况</p>
    <el-table
      :data="tableData"
      class="table"
      :row-class-name="tableRowClassName"
      :fit="true"
      border
    >
      <!-- 量表名称列：设置最小宽度+自适应 -->
      <el-table-column prop="name" label="量表名称" min-width="200" flex="2" />
      <!-- 完成时间列：最小宽度+自适应 -->
      <el-table-column
        prop="finishQuesTime"
        label="完成时间"
        min-width="160"
        flex="1"
      />
      <!-- 是否完成列：最小宽度+自适应 -->
      <el-table-column
        prop="questionStatus"
        label="是否完成"
        min-width="120"
        flex="1"
      />
      <!-- 操作列：固定右侧，设置宽度，优化对齐 -->
      <el-table-column fixed="right" label="操作" width="180" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="doQuestion(scope.row)"
          >
            去做题
          </el-button>
          <el-button
            link
            type="primary"
            size="small"
            @click="checkRes(scope.row)"
            :disabled="scope.row.questionStatus !== '已完成'"
          >
            查看结果
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="dialogVisible" title="测试结果" width="500">
    <span>这里放置图表默认内容</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { questionData } from "~/types/question/questionType";
definePageMeta({
  layout: "default",
});

const dialogVisible = ref(false);
const tableData: questionData[] = [
  {
    id: 1,
    name: "心理健康量表",
    finishQuesTime: "2023-10-01",
    questionStatus: "已完成",
  },
  {
    id: 2,
    name: "抑郁自评量表",
    finishQuesTime: "2023-10-05",
    questionStatus: "未开始",
  },
  {
    id: 3,
    name: "焦虑自评量表",
    finishQuesTime: "2023-10-10",
    questionStatus: "进行中",
  },
];

/**
 * 表格行样式类名回调
 * @param param0 行数据和索引
 * @returns 行样式类名
 */
const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: questionData;
  rowIndex: number;
}) => {
  if (row.questionStatus === "未开始") {
    return "warning-row";
  } else if (row.questionStatus === "已完成") {
    return "success-row";
  }
  return "";
};

/**
 * 点击“去做题”的回调
 * @param data 当前行的量表数据
 */
const doQuestion = (data: questionData) => {
  navigateTo({ name: "question-detail", params: { id: data.id } });
};

/**
 * 点击“查看结果”的回调
 * @param data 当前行的量表数据
 */
const checkRes = (data: questionData) => {
  // 补充空函数逻辑，避免无操作
  dialogVisible.value = true;
  
};
</script>

<style scoped lang="scss">
.question-container {
  margin: 0 auto; // 整体居中

  .bar {
    padding: 10px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
  }

  .title {
    text-align: center;
    margin-top: 60px; // 优化margin写法，避免上下左右都40px
    font-size: 40px;
    color: #303133;
    text-shadow: $box-shadow;
  }
  .description {
    text-align: center;
    margin-bottom: 60px;
    font-size: 14px;
    text-shadow: $box-shadow;
    color: #606266;
  }
  .table {
    width: 95%; // 改为100%，外层max-width控制整体宽度
    margin: 30px auto;
    border-radius: $radius-lg;
    box-shadow: $box-shadow;
    --el-table-header-text-color: #606266;
    --el-table-row-hover-bg-color: #f5f7fa;
  }
}

// 关键：用:deep()穿透scoped，确保行样式生效
:deep(.el-table .warning-row) {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
:deep(.el-table .success-row) {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

// 响应式优化：小屏适配
@media (max-width: 768px) {
  .question-container {
    .title {
      margin: 20px 0;
      font-size: 20px;
    }

    .table {
      --el-table-font-size: 14px;
    }

    // 小屏隐藏固定列，改为普通列（避免挤压）
    :deep(.el-table-column--fixed-right) {
      position: static !important;
      width: 100% !important;
    }
  }
}
</style>
