<template>
  <div class="new-conversation">
    <h1 class="title">你好啊，让我们开始聊天吧</h1>
    <conversationInput />
  </div>
</template>

<script setup lang="ts">


</script>

<style scoped lang="scss">
.new-conversation {
  .title {
    text-align: center;
    font-size: clamp(18px,4vw,40px);
    margin: 15vh 0;
    font-weight: 400;
  }
}
</style>
