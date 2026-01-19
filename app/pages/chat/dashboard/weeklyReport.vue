<template>
  <div class="weekly-container">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      format="YYYY年MM月DD日"
      value-format="YYYY-MM-DD"
      size="large"
      :disabled-date="disabledDate"
      @change="handleFixed7Days"
    />
    <p class="description">请选择7天</p>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

// 获取今天的开始时间（0点0分0秒）
const getToday = (): Dayjs => dayjs().startOf("day");

// 日期范围
const dateRange = ref<[string, string] | []>([]);

// 禁用日期函数（优化版）
const disabledDate = (time: Date): boolean => {
  const currentDate = dayjs(time).startOf("day");
  const today = getToday();

  // 直接禁用今日之后的所有日期
  return currentDate.isAfter(today);
};

// 处理固定7天选择
const handleFixed7Days = (val: [string, string] | null): void => {
  if (!val || val.length !== 2) {
    dateRange.value = [];
    return;
  }

  const [startDateStr] = val;
  const today = getToday();
  const startDate = dayjs(startDateStr).startOf("day");

  // 如果起始日期超过今天，清空选择
  if (startDate.isAfter(today)) {
    dateRange.value = [];
    return;
  }

  // 计算理论结束日期（起始日+6天）
  let endDate = startDate.add(6, "day");

  // 如果结束日期超过今天，则使用今天
  if (endDate.isAfter(today)) {
    endDate = today;
  }

  // 如果结束日期早于起始日期（理论上不会发生，但保持安全）
  if (endDate.isBefore(startDate)) {
    endDate = startDate;
  }

  dateRange.value = [
    startDate.format("YYYY-MM-DD"),
    endDate.format("YYYY-MM-DD"),
  ];
};

// 初始化默认选中本周（周一至今天）
const initDefaultWeek = (): void => {
  const today = getToday();

  // 计算本周一（中国习惯，周一为一周开始）
  let startOfWeek = today.startOf("week").add(1, "day");

  // 如果今天是周日，startOf("week")会返回上周日，需要调整
  if (today.day() === 0) {
    startOfWeek = today.subtract(6, "day").startOf("day");
  }

  // 如果本周一在今天之后，则取今天（理论上不会发生）
  if (startOfWeek.isAfter(today)) {
    startOfWeek = today;
  }

  // 结束日就是今天（因为不能选今天之后的日期）
  const endOfWeek = today;

  dateRange.value = [
    startOfWeek.format("YYYY-MM-DD"),
    endOfWeek.format("YYYY-MM-DD"),
  ];
};

// 挂载时初始化
onMounted(() => {
  initDefaultWeek();
});

// 监听今天变化，如果选择的日期超过今天，自动调整
watch(
  () => dayjs().date(), // 监听日期变化
  () => {
    if (dateRange.value.length !== 2) return;

    const [startDateStr, endDateStr] = dateRange.value;
    const today = getToday();
    const endDate = dayjs(endDateStr).startOf("day");

    // 如果结束日期超过今天，重新计算
    if (endDate.isAfter(today)) {
      handleFixed7Days([startDateStr, endDateStr]);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.weekly-container {
  .description {
    margin: 10px 0;
    font-size: 14px;
    color: #666;
  }
}
</style>
