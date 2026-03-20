<template>
  <ClientOnly>
    <h3 v-if="props.title" style="text-align: center">{{ props.title }}</h3>
    <div
      ref="containerRef"
      :style="{ margin: '0 auto', height: `${height}px` }"
      v-if="props.data !== null"
    >
      <VChartFull
        ref="vChartRef"
        :option="chartOption"
        :init-option="initOption"
        style="width: 100%; height: 100%"
      />
    </div>
    <el-empty description="暂无数据" v-else />
  </ClientOnly>
</template>

<script setup lang="ts">
import { pieChartOption } from "~/configs/chartConfig/pieChartConfig";
import type { pieChartProps } from "~/types/charts/pieChartType";

const props = defineProps<pieChartProps>();
const containerRef = ref<HTMLDivElement | null>(null);
const vChartRef = ref<any>(null);

const initOption = {
  renderer: "canvas",
  useDirtyRect: false,
  height: props.height,
};

const chartOption = pieChartOption(props.data, props.title);
// 5. 函数定义也确保格式正确
onMounted(() => {
  if (vChartRef.value && containerRef.value) {
    const { width, height } = containerRef.value.getBoundingClientRect();
    vChartRef.value.resize({ width, height });
    // isLoading.value = false;
  }

});

watch([() => props.width, () => props.height], () => {
  if (vChartRef.value) {
    vChartRef.value.resize({ width: props.width, height: props.height });
  }
});

</script>
