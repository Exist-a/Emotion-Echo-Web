<template>
  <div class="success-container">
    <el-result icon="success" title="修改成功!" sub-title="快去登陆吧!">
      <template #extra>
        <el-button type="primary" @click="gotoLogin">去登陆页</el-button>
      </template>
    </el-result>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "forget-pwd",
});
const gotoLogin = () => {
  const { resetState } = useForgetPwdState();
  resetState();
  navigateTo("/login");
};
</script>

<style scoped lang="scss">
.success-container {
  padding: 50px;
  width: 50vw;
  margin: 100px auto;
  background-color: #fff;
  border-radius: $radius-lg;
  box-shadow: $box-shadow;
}
</style>
