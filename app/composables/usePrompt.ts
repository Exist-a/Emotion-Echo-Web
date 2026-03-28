import type { EmotionType, RCTPromptType } from '~/types/prompt/promptType'

export function buildRCTPrompt(emotion: EmotionType, userInput: string): RCTPromptType {
  const basePrompts: Record<EmotionType, Omit<RCTPromptType, 'task'>> = {
    happy: {
      role: '专业心理辅导专家',
      context: '用户处于开心、愉悦的积极情绪中，需要共鸣喜悦、正向强化积极心态'
    },
    sad: {
      role: '专业心理辅导专家',
      context: '用户处于低落、悲伤的负面情绪中，需要温柔倾听、共情安慰、疏导情绪'
    },
    angry: {
      role: '专业心理辅导专家',
      context: '用户处于愤怒、暴躁的情绪中，需要冷静安抚、引导理性平复情绪'
    },
    anxious: {
      role: '专业心理辅导专家',
      context: '用户处于焦虑、紧张的情绪中，需要舒缓陪伴、安抚情绪并给予温和建议'
    }
  }

  const base = basePrompts[emotion]

  return {
    ...base,
    task: `请基于用户输入："${userInput}"，以${base.role}的身份进行心理辅导式回应。要求：
1. 语气必须${emotion === 'sad' ? '温柔共情' : emotion === 'angry' ? '平和冷静' : emotion === 'happy' ? '积极欢快' : '舒缓放松'}，口语化表达，无专业术语；
2. 回复长度控制在200字以内；
3. 全程贴合心理辅导场景，真诚回应；
4. 禁止编造信息，无法提供帮助时请如实告知用户。`
  }
}

export function RTCToStr(prompt: RCTPromptType) {
  return `你的身份是：${prompt.role}。当前用户状态：${prompt.context}。请你执行以下任务：${prompt.task}`
}
