<template>
  <div class="yearly-container">
    <el-date-picker
      v-model="year"
      type="year"
      format="YYYY年"
      placeholder="选择年份"
      size="large"
      :disabled-date="disabledYear"
      @change="handleYearChange"
    />
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

// 年份值，使用字符串格式（YYYY）
const year = ref<string>("");

// 获取当前日期
const getCurrentDate = (): Dayjs => dayjs();

// 禁用年份函数
const disabledYear = (date: Date): boolean => {
  const current = getCurrentDate();
  const selected = dayjs(date);
  const currentYear = current.year();
  const selectedYear = selected.year();
  
  // 禁用当前年份之后的年份（不能选择明年及以后）
  return selectedYear > currentYear;
};

// 处理年份选择变化
const handleYearChange = (): void => {
  if (!year.value) return;
  
  const current = getCurrentDate();
  const selected = dayjs(year.value, "YYYY");
  
  // 如果选择的年份超过当前年份，自动调整为当前年份
  if (selected.year() > current.year()) {
    year.value = current.format("YYYY");
    console.warn("不能选择未来年份，已自动调整为当前年份");
  }
};

// 初始化默认选中当前年份
const initDefaultYear = (): void => {
  year.value = getCurrentDate().format("YYYY");
};

// 挂载时初始化
onMounted(() => {
  initDefaultYear();
});

// 监听年份变化，执行验证
watch(year, () => {
  handleYearChange();
});

// 监听当前年份变化（跨年时自动调整）
watch(
  () => getCurrentDate().year(),
  () => {
    if (!year.value) return;
    
    const current = getCurrentDate();
    const selected = dayjs(year.value, "YYYY");
    
    // 如果当前选择的年份超过当前年份，自动调整
    if (selected.year() > current.year()) {
      year.value = current.format("YYYY");
      console.log("年份已自动调整到当前年");
    }
  }
);

// 更多禁用选项示例：

// 1. 只能选择过去10年内的年份（包括今年）
const disabledYearPast10Years = (date: Date): boolean => {
  const current = getCurrentDate();
  const selected = dayjs(date);
  const currentYear = current.year();
  const selectedYear = selected.year();
  const tenYearsAgo = currentYear - 10;
  
  // 禁用：早于10年前 或 晚于当前年
  return selectedYear < tenYearsAgo || selectedYear > currentYear;
};

// 2. 只能选择特定年份范围（如2020-2024年）
const disabledYearSpecificRange = (date: Date): boolean => {
  const selected = dayjs(date);
  const selectedYear = selected.year();
  const startYear = 2020;
  const endYear = 2024;
  
  // 不在2020-2024年范围内的年份都被禁用
  return selectedYear < startYear || selectedYear > endYear;
};

// 3. 禁止选择闰年
const disabledLeapYear = (date: Date): boolean => {
  const selected = dayjs(date);
  const selectedYear = selected.year();
  const current = getCurrentDate();
  
  // 判断是否为闰年：能被4整除但不能被100整除，或者能被400整除
  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };
  
  // 禁用闰年或未来年份
  return isLeapYear(selectedYear) || selectedYear > current.year();
};

// 获取选择的年份（如果需要提供给其他组件使用）
const getSelectedYear = () => year.value;

// 设置选择的年份（提供验证）
const setSelectedYear = (yearStr: string): boolean => {
  const current = getCurrentDate();
  const newYear = dayjs(yearStr, "YYYY");
  
  if (newYear.year() > current.year()) {
    console.error("不能设置未来年份");
    return false;
  }
  
  year.value = yearStr;
  return true;
};

// 判断是否是未来年份
const isFutureYear = (yearStr: string): boolean => {
  const current = getCurrentDate();
  return dayjs(yearStr, "YYYY").year() > current.year();
};
</script>

<style scoped>

/* 自定义年份选择器样式 */
:deep(.el-date-picker) {
  --el-datepicker-active-color: #409eff;
}

:deep(.el-date-picker .el-picker-panel__content) {
  width: 322px;
}

/* 禁用年份的样式 */
:deep(.el-date-picker .el-year-table .disabled .cell) {
  color: #c0c4cc;
  cursor: not-allowed;
  background-color: #f5f7fa;
}

:deep(.el-date-picker .el-year-table .disabled .cell:hover) {
  background-color: #f5f7fa;
}

/* 高亮当前年份 */
:deep(.el-date-picker .el-year-table .current:not(.disabled) .cell) {
  color: #409eff;
  font-weight: bold;
}
</style>