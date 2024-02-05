<script setup>
import { ref, nextTick, watch, onMounted } from "vue";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();

import { useCurrentChatInfoStore } from "@/stores/currentChatInfo.js";
let CurrentChatInfo = useCurrentChatInfoStore();

// ChatContainer组件元素
const ChatContainer = ref(null);
// ElScrollbar组件元素
const El_Scrollbar = ref(null);

// 控制ChatContainer组件的高度 ---> 只要浏览器视口不变
watch(
  () => ParametsSetting.BottomRight_ChatContainerHeight,
  (newValue) => {
    nextTick(() => {
      ChatContainer.value.style.height = `${newValue}px`;
    });
  },
  {
    immediate: true,
  }
);
// CurrentChatInfo.messages 的变化
watch(
  () => CurrentChatInfo.messages,
  () => {
    nextTick(() => {
      // 让El_Scrollbar到底部的方法
      El_Scrollbar.value.setScrollTop(999999);
    });
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<template>
  <!--  class="bg-red-100" -->
  <div ref="ChatContainer">
    <!-- -->
    <el-scrollbar ref="El_Scrollbar" :max-height="ParametsSetting.BottomRight_ChatContainerHeight">
      <div v-for="(item, index) in CurrentChatInfo.messages" :key="index">
        <div v-if="item.role === 'system'" class="chat chat-start">
          <div class="chat-bubble chat-bubble-accent">
            <v-md-preview :text="item.content"></v-md-preview>
          </div>
        </div>
        <div v-else-if="item.role === 'user'" class="chat chat-end">
          <div class="chat-bubble chat-bubble-info">
            <div class="break-words overflow-hidden">
              <v-md-preview :text="item.content"></v-md-preview>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped></style>
