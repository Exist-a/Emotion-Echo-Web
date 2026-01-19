<template>
  <div class="conversation-container">
    <conversationList @startNewConversation="startNewConversation" />
    <main class="main">
      <NuxtPage></NuxtPage>
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const isNewConversation = computed(() => {
  return route.params.id === undefined;
});
const startNewConversation = () => {
  if (isNewConversation.value) {
    return;
  }
  navigateTo("/chat/conversation/new");
};
const openOldConversation = (id: number) => {
  navigateTo(`/chat/conversation/${id}`);
};
provide("openOldConversation", openOldConversation);
</script>

<style scoped lang="scss">
.conversation-container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: $radius-lg;
  box-shadow: $box-shadow;
  display: flex;
  .main {
    flex: 1;
    padding: 10px;
  }
}
</style>
