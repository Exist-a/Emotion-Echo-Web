<template>
  <div class="verify-container">
    <h2 class="title">确认账号</h2>
    <!-- 用 el-form 包裹，配置校验规则 -->
    <el-form ref="formRef" :model="formInfo" :rules="rules" class="form">
      <el-form-item prop="username" label="账号" label-position="top">
        <el-input
          v-model="formInfo.username"
          placeholder="请输入账号"
          class="input"
        />
      </el-form-item>

      <el-form-item prop="verificationCode" label="验证码" label-position="top">
        <el-input
          v-model="formInfo.verificationCode"
          :show-password="true"
          placeholder="请输入验证码"
          class="input"
        >
          <template #append>
            <el-button
              @click="getVerificationCode"
              :disabled="isGetVerificationCode"
              type="primary"
            >
              {{
                isGetVerificationCode
                  ? lastSeconds + verificationCodeText
                  : "获取验证码"
              }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <el-button class="btn" type="primary" @click="gotoModify">
      确认账号</el-button
    >
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(["changeActive"]);
const formRef = ref();
// 表单数据
const formInfo = ref({
  username: "",
  verificationCode: "",
});
const rules = ref({
  username: [
    { required: true, message: "请输入手机号或邮箱", trigger: "blur" },
    {
      pattern: phoneOrEmailReg,
      message: "请输入有效的手机号或邮箱",
      trigger: "blur",
    },
  ],
  verificationCode: [{ required: true, message: "请输入验证码" }],
});

const { startCountdown, isGetVerificationCode, lastSeconds } =
  verificationCodeCountDown();

// const isGetVerificationCode = ref(false);
//获取验证码逻辑

const verificationCodeText = "秒后重新获取";
const getVerificationCode = () => {
  formRef.value?.validateField("username", (error: boolean) => {
    console.log(error);
    if (!error) {
      ElNotification({
        title: "无法获取验证码",
        message: "请填写正确的账户",
        type: "error",
      });
      return;
    }
    //先后端请求，返回成功后执行下面代码
    ElNotification({
      title: "验证码已发送",
      message: "请注意查收",
      type: "success",
    });
    startCountdown();
  });
};
const gotoModify = () => {
  //向后端发送请求，返回后判断是否合法。是则跳转
  navigateTo("/login/forget/modify");
  const { updateStep } = useForgetPwdState();
  updateStep(1);
  emits("changeActive");
};
</script>

<style scoped lang="scss">
.verify-container {
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
  .form {
    .input {
      height: 40px;
      width: 100%;
      // margin-top: 15px;
    }
  }
  .btn {
    height: 40px;
    margin: 10px 0;
    width: 100%;
  }
}
</style>
