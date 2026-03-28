import type { RCTPromptType } from '~/types/prompt/promptType'
import { RTCToStr } from './usePrompt'
import type { useAIStreamReturnInterface } from '~/types/api/chatAPIType'
export const useAIStream = (prompt: RCTPromptType): useAIStreamReturnInterface => {
  const controller = new AbortController()
  const context = ref('')
  const loading = ref(true)
  const promptStr = RTCToStr(prompt)
  const fetchStream = async () => {
    loading.value = false
    try {
      const res = await fetch('', {
        method: 'POST',
        body: JSON.stringify(promptStr),
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) return
      let buffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk
        const blocks = buffer.split('\n\n')
        buffer = blocks.pop() || ''
        blocks.forEach((block) => {
          context.value += processCompleteBlock(block)
        })
      }
    } catch (err) {
      return err
    } finally {
      loading.value = true
    }
  }

  return {
    controller,
    context,
    loading,
    fetchStream
  }
}
const processCompleteBlock = (block: string) => {
  if (!block.startsWith('data: ')) return
  const data = safeJsonParse(block.replace('data: ', '').trim())
  if (!data?.content) return

  return data.content
}

const safeJsonParse = (str: string) => {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}
