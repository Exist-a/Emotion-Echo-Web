<template>
  <!-- 加动态类区分移动端 -->
  <div class="verify-container" :class="{ 'mobile-verify-container': $device.isMobile }">
    <h2 class="title">确认账号</h2>
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
              :size="$device.isMobile ? 'small' : 'default'"
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
      确认账号
    </el-button>
  </div>
</template>

<script setup lang="ts">
// 补充缺失的依赖和正则（保证代码可运行）
import { ElNotification } from "element-plus";
import { useForgetPwdState } from "~/composables/forgetPwdState"; // 请根据实际路径调整

// 手机号/邮箱正则
const phoneOrEmailReg = /^(?:1[3-9]\d{9}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

// 验证码倒计时函数
const verificationCodeCountDown = () => {
  const isGetVerificationCode = ref(false);
  const lastSeconds = ref(60);
  let timer: NodeJS.Timeout | null = null;

  const startCountdown = () => {
    isGetVerificationCode.value = true;
    lastSeconds.value = 60;
    timer = setInterval(() => {
      lastSeconds.value--;
      if (lastSeconds.value <= 0) {
        clearInterval(timer!);
        isGetVerificationCode.value = false;
      }
    }, 1000);
  };

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { isGetVerificationCode, lastSeconds, startCountdown };
};

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

const verificationCodeText = "秒后重新获取";
const getVerificationCode = () => {
  formRef.value?.validateField("username", (error: string) => {
    // 修正校验逻辑：error为空时表示校验通过
    if (error) {
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
// PC端样式（原有样式保留）
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
    font-size: 20px;
  }
  .form {
    .input {
      height: 40px;
      width: 100%;
      margin-bottom: 15px;
      border-radius: $radius-mid;
    }
  }
  .btn {
    height: 40px;
    margin: 10px 0;
    width: 100%;
    border-radius: $radius-mid;
  }
}

// 移动端适配样式
.mobile-verify-container {
  width: 100% !important; // 移动端占90%宽度
  margin: 50px auto !important; // 减少上下间距
  padding: 20px 15px !important; // 减少内边距

  .title {
    font-size: 18px !important; // 缩小标题字体
    margin-bottom: 15px !important;
  }
  .form {
    .input {
      height: 44px !important; // 移动端输入框高度适配触摸
      margin-bottom: 20px !important;
    }

  }
  .btn {
    height: 44px !important; // 移动端按钮高度适配触摸
    font-size: 16px !important;
    margin: 15px 0 !important;
  }
}

// 平板端兜底
@media (max-width: 1024px) and (min-width: 768px) {
  .verify-container {
    width: 50vw !important;
    padding: 25px 30px !important;
  }
}
</style>