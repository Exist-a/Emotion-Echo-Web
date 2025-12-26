<template>
  <div class="nav-container">
    <el-menu default-active="1" class="menu">
      <NuxtLink to="/chat/conversation">
        <el-menu-item index="1" class="menu-item">
          <el-icon><ChatLineSquare /></el-icon>
          <template #title>聊天</template>
        </el-menu-item>
      </NuxtLink>

      <el-sub-menu index="2" class="menu-item">
        <template #title>
          <el-icon><PieChart /></el-icon>
          <span>统计</span>
        </template>
        <NuxtLink to="/chat/dashboard/dailyReport">
          <el-menu-item index="1-1">日度分析</el-menu-item>
        </NuxtLink>
        <NuxtLink to="/chat/dashboard/weeklyReport">
          <el-menu-item index="1-2">周度分析</el-menu-item>
        </NuxtLink>
        <NuxtLink to="/chat/dashboard/monthlyReport">
          <el-menu-item index="1-3">月度分析</el-menu-item>
        </NuxtLink>
        <NuxtLink to="/chat/dashboard/annualReport">
          <el-menu-item index="1-4">年度分析</el-menu-item>
        </NuxtLink>
      </el-sub-menu>
      <!-- </el-menu-item> -->
      <NuxtLink to="/chat/user">
        <el-menu-item index="3" class="menu-item">
          <el-icon><User /></el-icon>
          <template #title>我的</template>
        </el-menu-item>
      </NuxtLink>
      <NuxtLink to="/chat/setting">
        <el-menu-item index="4" class="menu-item">
          <el-icon><Setting /></el-icon>
          <template #title>设置</template>
        </el-menu-item>
      </NuxtLink>
    </el-menu>
    <main style="padding: 20px; flex: 1;"><slot /></main>
  </div>
</template>

<script setup lang="ts">
import {
  ChatLineSquare,
  PieChart,
  Setting,
  User,
} from "@element-plus/icons-vue";
</script>

<style scoped lang="scss">
.nav-container {
  display: flex;

  .menu {
    padding: 5px;
    height: 100vh;
  }
}
</style>
