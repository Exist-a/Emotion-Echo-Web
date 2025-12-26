<template>
  <div class="login-container">
    <div class="mask" ref="mask">
      <h2 class="mask-title">
        <template v-for="(line, index) in splitPoem" :key="index">
          <p class="poem-line">{{ line }}</p>
        </template>
      </h2>
      <p class="mask-desc">
        {{ isLogin ? "还没有账号？去注册" : "已经有账号了？去登陆" }}
      </p>
      <el-button
        class="mask-btn"
        :circle="true"
        @click="switchMask"
        :disabled="isDisable"
      >
        <el-icon size="30px"><Switch /></el-icon>
      </el-button>
    </div>

    <el-form
      class="register"
      ref="registerFormRef"
      :model="registerInfo"
      :rules="registerRules"
    >
      <h1 class="register-title">注册</h1>

      <el-form-item label="账号" label-position="top" prop="username">
        <el-input
          v-model="registerInfo.username"
          class="register-input"
          placeholder="请输入手机号/邮箱"
        />
      </el-form-item>

      <el-form-item label="密码" label-position="top" prop="password">
        <el-input
          v-model="registerInfo.password"
          type="password"
          :show-password="true"
          class="register-input"
          placeholder="请输入密码"
        />
      </el-form-item>

      <el-form-item label="验证码" label-position="top">
        <el-input
          v-model="registerInfo.verificationCode"
          :show-password="true"
          class="register-input"
          placeholder="请输入验证码"
        >
          <template #append>
            <el-button
              @click="getVerificationCode"
              ref="verificationCodeRef"
              :disabled="isGetVerificationCode"
              type="primary"
              >{{
                isGetVerificationCode
                  ? lastSeconds + verificationCodeText
                  : "获取验证码"
              }}</el-button
            >
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="register-btn" @click="registerHandler">
          注册
        </el-button>
      </el-form-item>
    </el-form>

    <el-form
      class="login"
      ref="loginFormRef"
      :model="loginInfo"
      :rules="loginRules"
    >
      <h1 class="login-title">登陆</h1>

      <el-form-item label="账号" label-position="top" prop="username">
        <!-- 【修改4：placeholder从“请输入登录账号”改为“请输入手机号/邮箱”】 -->
        <el-input
          v-model="loginInfo.username"
          class="login-input"
          placeholder="请输入手机号/邮箱"
        />
      </el-form-item>

      <el-form-item label="密码" label-position="top" prop="password">
        <el-input
          v-model="loginInfo.password"
          type="password"
          :show-password="true"
          class="login-input"
          placeholder="请输入密码"
        />
      </el-form-item>

      <div class="login-text">
        <el-checkbox label="记住我" v-model="isRemember" />
        <NuxtLink to="/login/forget/verify">忘记密码</NuxtLink>
      </div>

      <el-form-item>
        <el-button type="primary" class="login-btn" @click="loginHandler">
          登陆
        </el-button>
      </el-form-item>

      <div class="other-way">
        <img src="/assets/icons/微信.svg" alt="" @click="wechatLogin" />
        <img src="/assets/icons/腾讯QQ.svg" alt="" @click="QQLogin" />
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from "element-plus";
import { Switch } from "@element-plus/icons-vue";
import type { loginInfo, registerInfo } from "~/types/login/loginType";

const originalWarn = console.warn;
const originalLog = console.log;
// 重写 console.warn，过滤 async-validator 相关警告
console.warn = function (...args) {
  if (args.some((arg) => arg?.includes?.("async-validator"))) return;
  originalWarn.apply(console, args);
};

// 重写 console.log，过滤 async-validator 相关日志（部分版本会用 log 输出）
console.log = function (...args) {
  if (args.some((arg) => arg?.includes?.("async-validator"))) return;
  originalLog.apply(console, args);
};

onUnmounted(() => {
  console.warn = originalWarn;
  console.log = originalLog;
});

const loginFormRef = ref();
const registerFormRef = ref();
const verificationCodeRef = ref();
const loginInfo = shallowReactive<loginInfo>({
  username: "",
  password: "",
});
const registerInfo = shallowReactive<registerInfo>({
  username: "",
  password: "",
  verificationCode: "",
});

// 登录表单校验规则
const loginRules = ref({
  username: [
    { required: true, message: "请输入手机号/邮箱", trigger: "blur" },
    // 【修改6：替换为手机号/邮箱的正则和提示】
    {
      pattern: phoneOrEmailReg,
      message: "请输入有效的手机号或邮箱",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: passwordReg,
      message: "密码需为6-18位，且包含字母和数字",
      trigger: "blur",
    },
  ],
});

const registerRules = ref({
  username: [
    { required: true, message: "请输入手机号/邮箱", trigger: "blur" },
    // 【修改7：替换为手机号/邮箱的正则和提示】
    {
      pattern: phoneOrEmailReg,
      message: "请输入有效的手机号或邮箱",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      pattern: /^(?=.*[a-zA-Z])(?=.*\d).{6,18}$/,
      message: "密码需为6-18位，且包含字母和数字",
      trigger: "blur",
    },
  ],
  // verificationCode: [
  //   { required: true, message: "请输入验证码", trigger: "blur" },
  //   { validator: validateConfirmPassword, trigger: "blur" },
  // ],
});
const isDisable = ref(false);
const isRemember = ref<boolean>(false);
const isLogin = ref<boolean>(true);
const mask = ref<HTMLDivElement>();
const welcomePoems = [
  "有朋自远方来， 不亦乐乎?",
  "花径不曾缘客扫， 蓬门今始为君开。",
  "晚来天欲雪， 能饮一杯无？",
  "开轩面场圃， 把酒话桑麻。",
  "正是江南好风景， 落花时节又逢君。",
];

const poem = useState("random-poem", () => {
  const randomIndex = Math.floor(Math.random() * welcomePoems.length);
  return welcomePoems[randomIndex] as string;
});

const splitPoem = computed(() => {
  return poem.value
    .split(" ")
    .map((line) => line.trim())
    .filter((line) => line);
});

const switchMask = () => {
  isLogin.value = !isLogin.value;
  if (mask.value) {
    mask.value.classList.remove("mask-register", "mask-login");
    mask.value?.classList.add(!isLogin.value ? "mask-register" : "mask-login");
  }
  isDisable.value = true;
  let timer = setTimeout(() => {
    isDisable.value = false;
    clearTimeout(timer);
  }, 2000);
};

const loginHandler = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 校验通过，执行登录逻辑
    }
  });
};
const registerHandler = () => {
  registerFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 校验通过，执行登录逻辑
    }
  });
};

//获取验证码逻辑
const { startCountdown, isGetVerificationCode, lastSeconds } =
  verificationCodeCountDown();
const verificationCodeText = "秒后重新获取";
const getVerificationCode = () => {
  if (!phoneOrEmailReg.test(registerInfo.username)) {
    //账户校验不通过
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
};
const wechatLogin = () => {
  //微信登陆逻辑
};
const QQLogin = () => {
  //qq登陆逻辑
};
</script>

<style scoped lang="scss">
/* 样式部分完全未修改，保持原样 */
@keyframes maskAnimationRegister {
  0% {
    width: 50%;
    left: 0;
    border-radius: $radius-lg 160px 160px $radius-lg;
  }
  30% {
    width: 100%;
    left: 0;
    border-radius: $radius-lg;
  }
  50% {
    width: 100%;
    left: 0;
    border-radius: $radius-lg;
  }
  80% {
    width: 50%;
    left: 50%;
    border-radius: 160px $radius-lg $radius-lg 160px;
  }
  100% {
    width: 50%;
    left: 50%;
    border-radius: 160px $radius-lg $radius-lg 160px;
  }
}

@keyframes maskAnimationLogin {
  0% {
    width: 50%;
    left: 50%;
    border-radius: 160px $radius-lg $radius-lg 160px;
  }
  30% {
    width: 100%;
    left: 0;
    border-radius: $radius-lg;
  }
  50% {
    width: 100%;
    left: 0;
    border-radius: $radius-lg;
  }
  80% {
    width: 50%;
    left: 0;
    border-radius: $radius-lg 160px 160px $radius-lg;
  }
  100% {
    width: 50%;
    left: 0;
    border-radius: $radius-lg 160px 160px $radius-lg;
  }
}

.login-container {
  display: flex;
  height: 70vh;
  width: 55vw;
  background-color: #ffffff;
  margin: auto;
  transform: translateY(17vh);
  border-radius: $radius-lg;
  box-shadow: $box-shadow;
  position: relative;

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: $radius-lg 160px 160px $radius-lg;
    width: 50%;
    z-index: 5;
    height: 100%;
    background-color: #0077c2;
    padding-top: 25%;
    padding: 20% 10px 0;

    &.mask-register {
      animation: maskAnimationRegister 2s ease-in-out forwards;
    }

    &.mask-login {
      animation: maskAnimationLogin 2s ease-in-out forwards;
    }

    .mask-title {
      font-family: "maskTitle";
      font-size: 2.3em;
      text-align: center;
      line-height: 1.5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .poem-line {
      display: block;
      width: 100%;
    }

    .mask-desc {
      margin-top: 10px;
      text-align: center;
      font-size: 14px;
      color: #313131;
    }

    .mask-btn {
      display: block;
      margin: 40px auto;
      height: 60px;
      width: 60px;
    }
  }

  .login {
    height: 100%;
    padding: 5vh 30px;
    width: 50%;
    position: absolute;
    left: 50%;
    overflow: hidden;

    .login-title {
      text-align: center;
      font-size: 5vh;
      margin-bottom: 2vh;
    }

    .login-input {
      width: 100%;
      height: 40px;
      margin-bottom: 1vh;
    }

    .login-text {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #666666;
      margin: 1.5vh 0;

      a {
        line-height: 32px;
        cursor: pointer;
      }
    }

    .login-btn {
      width: 100%;
      margin-top: 1.5vh;
      height: 2.5em;
      border-radius: $radius-mid;
      font-size: 18px;
    }
    .other-way {
      display: flex;
      justify-content: space-around;
      margin-top: 3vh;
      img {
        height: 50px;
        object-fit: contain;
      }
    }
  }
  .register {
    padding: 6vh 30px;
    width: 50%;
    position: absolute;
    overflow: hidden;

    .register-title {
      text-align: center;
      font-size: 5vh;
      margin-bottom: 2vh;
    }

    .register-input {
      width: 100%;
      height: 40px;
    }

    .register-btn {
      width: 100%;
      margin: 1.5vh 0;
      height: 2.5em;
      border-radius: $radius-mid;
      font-size: 18px;
    }
  }
}
</style>
