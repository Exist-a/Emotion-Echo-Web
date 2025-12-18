export const useForgetPwdState = () => {
  // 流程步骤：0=未开始，1=已完成确认账号，2=已完成验证码验证，3=已完成密码修改
  const currentStep = useState<number>('forgetPwdStep', () => 0)
  // 存储用户账号（手机号/邮箱，可选）
  const userAccount = useState<string>('forgetPwdAccount', () => '')

  // 更新步骤
  const updateStep = (step: number) => {
    currentStep.value = step
  }

  // 重置状态
  const resetState = () => {
    currentStep.value = 0
    userAccount.value = ''
  }

  return {
    currentStep,
    userAccount,
    updateStep,
    resetState
  }
}