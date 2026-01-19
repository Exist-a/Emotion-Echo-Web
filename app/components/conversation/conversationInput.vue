<template>
  <div class="conversationInput-container">
    <textarea name="" id="" class="conversation-textarea" rows="7" v-model="message" :style="{ fontSize: userConfig.fontSize }"></textarea>
    <div class="actions">
      <div class="left">
        <el-button :icon="Paperclip" circle/>
      </div>
      <div class="right">
        <el-button :icon="Microphone" />
        <el-divider
          direction="vertical"
          border-style="dashed"
          style="height: 32px"
        />
        <el-button :circle="true" :icon="Promotion" type="primary" @click="sendMessage"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Promotion, Microphone, Paperclip } from "@element-plus/icons-vue";
const userStore = useUserStore();
const userConfig = ref(userStore.getUserConfig());
const message = ref('')
const route = useRoute()
const sendMessage = ()=>{
  if(route.params.id){
    //代表在会话中发送信息
  }else{
    //不会话中发送信息时，需要新建会话
    
  }
}
</script>

<style lang="scss" scoped>
.conversationInput-container {
  border-radius: $radius-xxl;
  border: 1px solid #9f9f9f;
  width: 80%;
  margin: 0 auto;
  padding: 15px 10px;
  .conversation-textarea {
    resize: unset;
    border: none;
    width: 100%;
  }
  .actions {
    display: flex;
    justify-content: space-between;
    .right {
      display: flex;
    }
  }
}
</style>
