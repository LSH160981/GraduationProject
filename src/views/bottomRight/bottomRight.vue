<script setup>
import { ref, watch, nextTick } from "vue";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
import ChatContainer from "./chatContainer.vue";
import ChatInput from "./chatInput.vue";
let ParametsSetting = useParametsSettingStore();

// BottomRight 组件元素
let BottomRight = ref(null);
// 控制BottomRight组件的高度
watch(
  () => ParametsSetting.BottomHeight,
  (newValue) => {
    nextTick(() => {
      BottomRight.value.style.height = `${newValue}px`;
    });
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div ref="BottomRight" class="p-2">
    <div class="chatContainer">
      <ChatContainer></ChatContainer>
    </div>
    <div class="chatInput">
      <ChatInput></ChatInput>
    </div>
  </div>
</template>

<style scoped></style>
