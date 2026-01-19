<template>
  <div class="daily-container">
    <el-date-picker
      v-model="date"
      type="date"
      format="YYYY年MM月DD日"
      placeholder="选择一个日期"
      size="large"
      :disabled-date="disabledDate"
    />
    <chartCard :data="data"></chartCard>
  </div>
</template>

<script setup lang="ts">
import ChartCard from "~/components/report/chartsCard.vue";
import type { ChartItem } from "~/types/charts/common";
const date = ref(new Date());
const data:ChartItem[] = [
  {
    chartType: "pie",
    title: "用户来源分布",
    data: [
      { name: "微信公众号", value: 1280 },
      { name: "抖音推广", value: 850 },
      { name: "官网自然流量", value: 520 },
      { name: "小红书", value: 310 },
      { name: "其他渠道", value: 180 },
    ],
  },
  {
    chartType: "line",
    title: "一周活跃用户数",
    XData: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    YData: [820, 932, 901, 934, 1290, 1330, 1320],
  },
  {
    XData: ["产品A", "产品B", "产品C", "产品D", "产品E"],
    YData: [120, 200, 150, 80, 70],
    chartType: "bar",
    title: "各产品销量对比",
  },
];

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};
</script>

<style scoped></style>
