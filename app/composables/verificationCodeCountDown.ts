import { ref } from 'vue'

export const verificationCodeCountDown = () => {
  const isGetVerificationCode = ref(false)
  const lastSeconds = ref(60)
  const verificationCodeText = '秒后重新获取'
  let timer: NodeJS.Timeout | null = null
  let interval: NodeJS.Timeout | null = null

  // 启动倒计时
  const startCountdown = () => {
    isGetVerificationCode.value = true
    lastSeconds.value = 60 // 重置秒数

    // 清除旧定时器，避免叠加
    if (timer) clearTimeout(timer)
    if (interval) clearInterval(interval)

    timer = setTimeout(() => {
      isGetVerificationCode.value = false
    }, 60000)

    interval = setInterval(() => {
      lastSeconds.value--
      if (lastSeconds.value === 0) {
        clearInterval(interval!)
      }
    }, 1000)
  }

  // 停止倒计时（可选）
  const stopCountdown = () => {
    isGetVerificationCode.value = false
    if (timer) clearTimeout(timer)
    if (interval) clearInterval(interval)
  }

  return {
    isGetVerificationCode,
    lastSeconds,
    verificationCodeText,
    startCountdown,
    stopCountdown
  }
}