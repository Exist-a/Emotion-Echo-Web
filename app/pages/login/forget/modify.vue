<template>
  <div class="modify-container">
    <h2 class="title">修改密码</h2>
    <el-form :rules="rules" :model="formInfo" ref="formRef">
      <el-form-item label="新密码" label-position="top" prop="newPassword">
        <el-input
          placeholder="请输入新密码"
          class="input"
          v-model="formInfo.newPassword"
          :show-password="true"
          type="password"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        label-position="top"
        prop="confirmNewPassword"
      >
        <el-input
          placeholder="请再次输入密码"
          class="input"
          v-model="formInfo.confirmNewPassword"
          :show-password="true"
          type="password"
        />
      </el-form-item>
    </el-form>
    <el-button class="btn" type="primary" @click="gotoSuccess">
      确认修改</el-button
    >
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "forget-pwd",
});
const emits = defineEmits(["changeActive"]);
const formRef = ref();
const gotoSuccess = () => {
  formRef.value.validate((status: boolean) => {
    if (!status) {
      ElNotification({
        type: "error",
        title: "密码修改失败",
        message: "请检查格式",
      });
      return;
    }
    const { updateStep } = useForgetPwdState();
    updateStep(2);
    navigateTo("/login/forget/success");
    emits("changeActive");
  });
  //后端请求
};
const formInfo = ref({
  newPassword: "",
  confirmNewPassword: "",
});
const rules = ref({
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    {
      pattern: passwordReg, // 替换为正确的密码正则
      message: "密码需为6-18位，且包含字母和数字",
      trigger: "blur",
    },
  ],
  confirmNewPassword: [
    { required: true, message: "请输入确认密码", trigger: "blur" }, // 修正文案
    {
      // 自定义校验器：校验与新密码一致
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== formInfo.value.newPassword) {
          callback(new Error("两次输入的密码不一致")); // 不一致则返回错误
        } else {
          callback(); // 一致则校验通过
        }
      },
      trigger: "blur",
    },
  ],
});
</script>

<style lang="scss" scoped>
.modify-container {
  box-shadow: $box-shadow;
  margin: 100px auto;
  padding: 30px 40px;
  background-color: #fff;
  width: 30vw;
  border-radius: $radius-lg;

  .title {
    margin-bottom: 10px;
    text-align: center;
  }
  .btn {
    height: 40px;
    margin: 10px 0;
    width: 100%;
  }
  .input {
    height: 40px;
  }
}
</style>
