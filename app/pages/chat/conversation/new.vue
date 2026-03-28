<template>
  <div class="new-conversation">
    <h1 class="title">你好啊，让我们开始聊天吧</h1>
    <conversationInput @start-new-conversation="startNewConversation" :type="'new'" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const startNewConversation = (message: string) => {
  const id = 5
  router.push({
    path: `/chat/conversation/${id}`,
    query: {
      initMessage: message // 把用户输入的第一条消息传过去
    }
  })
}
</script>

<style scoped lang="scss">
.new-conversation {
  .title {
    text-align: center;
    font-size: clamp(18px, 4vw, 40px);
    margin: 15vh 0;
    font-weight: 400;
  }
}
</style>
