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
import ChartCard from '~/components/report/chartsCard.vue'
import type { ChartItem } from '~/types/charts/common'
const date = ref(new Date())
const data: ChartItem[] = [
  {
    chartType: 'pie',
    title: '我的咨询情绪类型分布',
    data: [
      { name: '焦虑情绪', value: 18 },
      { name: '压力情绪', value: 12 },
      { name: '低落情绪', value: 8 },
      { name: '烦躁情绪', value: 5 },
      { name: '其他情绪', value: 2 }
    ]
  },
  {
    chartType: 'line',
    title: '我的一周咨询次数',
    XData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    YData: [2, 3, 2, 3, 5, 6, 5]
  },
  {
    XData: ['焦虑疏导', '压力缓解', '情绪倾诉', '睡眠调节', '其他咨询'],
    YData: [8, 12, 9, 5, 3],
    chartType: 'bar',
    title: '我的各类情绪咨询量'
  }
]
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}
</script>

<style scoped></style>
