<template>
  <div class="monthly-container">
    <el-date-picker
      v-model="month"
      type="month"
      format="YYYY年MM月"
      placeholder="选择一个月份"
      size="large"
      :disabled-date="disabledMonth"
    />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

// 月份值，使用字符串格式（YYYY-MM）
const month = ref<string>("");

// 获取当前日期
const getCurrentDate = (): Dayjs => dayjs().startOf("day");

// 禁用月份函数
const disabledMonth = (date: Date): boolean => {
  const current = getCurrentDate();
  const selected = dayjs(date);
  
  // 禁用当前月份之后的月份
  return selected.isAfter(current, "month");
};

// 处理月份选择
const handleMonthChange = (): void => {
  if (!month.value) return;
  
  const current = getCurrentDate();
  const selected = dayjs(month.value);
  
  // 如果选择的月份超过当前月份，自动调整为当前月份
  if (selected.isAfter(current, "month")) {
    month.value = current.format("YYYY-MM");
    // 可以添加提示
    console.warn("不能选择未来月份，已自动调整为当前月份");
  }
};

// 初始化默认选中当前月份
const initDefaultMonth = (): void => {
  month.value = getCurrentDate().format("YYYY-MM");
};

// 挂载时初始化
onMounted(() => {
  initDefaultMonth();
});

// 监听月份变化，执行验证
watch(month, () => {
  handleMonthChange();
});

// 监听当前月份变化（跨月时自动调整）
watch(
  () => getCurrentDate().month(),
  () => {
    if (!month.value) return;
    
    const current = getCurrentDate();
    const selected = dayjs(month.value);
    
    // 如果当前选择的月份超过当前月份，自动调整
    if (selected.isAfter(current, "month")) {
      month.value = current.format("YYYY-MM");
      console.log("月份已自动调整到当前月");
    }
  }
);

// 如果你想要更严格的限制：只能选择过去6个月内（包括当前月）
const strictDisabledMonth = (date: Date): boolean => {
  const current = getCurrentDate();
  const selected = dayjs(date);
  
  // 计算6个月前
  const sixMonthsAgo = current.subtract(6, "month");
  
  // 禁用：早于6个月前 或 晚于当前月
  return selected.isBefore(sixMonthsAgo, "month") || selected.isAfter(current, "month");
};

// 如果你需要允许选择当前月，但禁止未来月
const allowCurrentMonthOnly = (date: Date): boolean => {
  const current = getCurrentDate();
  const selected = dayjs(date);
  
  // 严格禁用当前月之后的月份
  return selected.isAfter(current, "month");
};
</script>

<style scoped>
.monthly-container {
  display: inline-block;
}

/* 可选的样式优化 */
:deep(.el-date-picker) {
  --el-datepicker-active-color: #409eff;
}

:deep(.el-date-picker .el-picker-panel__content) {
  width: 322px;
}

/* 禁用月份的样式 */
:deep(.el-date-picker .el-month-table .disabled .cell) {
  color: #c0c4cc;
  cursor: not-allowed;
  background-color: #f5f7fa;
}

:deep(.el-date-picker .el-month-table .disabled .cell:hover) {
  background-color: #f5f7fa;
}
</style>