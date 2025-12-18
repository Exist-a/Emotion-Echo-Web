<template>
  <div class="forget-container">
    <el-steps
      style="max-width: 80vw"
      :active="active"
      finish-status="success"
      :space="300"
      simple
    >
      <el-step title="确认账户" :icon="Lock" />
      <el-step title="修改密码" :icon="Edit" />
      <el-step title="修改成功" :icon="Check" />
    </el-steps>
    <main>
      <NuxtPage @changeActive="changeActive" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Lock, Edit, Check } from "@element-plus/icons-vue";
const route = useRoute();
const router = useRouter();

// 核心：定义「路由路径」与「步骤值」的映射表（根据你的实际路由路径调整）
const routeStepMap = new Map([
  ["/login/forget/confirm", 0], // 确认账户 → 步骤0
  ["/login/forget/modify", 1], // 修改密码 → 步骤1
  ["/login/forget/success", 2], // 修改成功 → 步骤2
]);

// 初始化 active 值：根据当前路由匹配
const active = ref(routeStepMap.get(route.path) || 0);
// 监听路由变化：浏览器后退/前进时，同步更新 active
watch(
  () => route.path, // 监听路由路径变化
  (newPath) => {
    active.value = routeStepMap.get(newPath) || 0;
  },
  { immediate: true } // 初始化时执行一次
);

// 处理子组件的“下一步”事件：跳转到对应路由
const changeActive = () => {
  const currentStep = active.value;
  // 根据当前步骤，获取下一个路由
  const nextRoute = Array.from(routeStepMap.entries()).find(
    ([_, step]) => step === currentStep + 1
  )?.[0];

  if (nextRoute) {
    router.push(nextRoute); // 跳转到下一个路由（路由变化会自动更新 active）
  }
};

</script>

<style scoped lang="scss">
.forget-container {
  padding: 80px 10vw;
  height: 100vw;
  background-color: $bg-color;
}
</style>
