<script setup>
import { ref, nextTick, watch, onMounted } from "vue";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();

import { useCurrentChatInfoStore } from "@/stores/CurrentChatInfo.js";
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

// 是否显示这对按钮 去到当前对话的顶部和底部
let ShowButtonFlag = ref(false);
// 鼠标进入 chatContainer 的回调
const Show_Up_Down_Button = () => {
  if (CurrentChatInfo.messages.length > 0) {
    ShowButtonFlag.value = true;
  }
};

// 去到当前对话的顶部
const GoToChatTop = () => {
  El_Scrollbar.value.setScrollTop(0);
};
// 去到当前对话的底部
const GoToChatBottom = () => {
  El_Scrollbar.value.setScrollTop(999999);
};
</script>

<template>
  <!--  class="bg-red-100" -->
  <div
    ref="ChatContainer"
    class="relative"
    @mouseenter="Show_Up_Down_Button"
    @mouseleave="ShowButtonFlag = false">
    <!-- -->
    <el-scrollbar ref="El_Scrollbar" :max-height="ParametsSetting.BottomRight_ChatContainerHeight">
      <div v-if="CurrentChatInfo.messages.length">
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
      </div>
      <div
        v-else
        class="select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="flex flex-col justify-center items-center gap-6">
          <!-- 图标 -->
          <div class="w-20 h-20">
            <img src="@/assets/images/chatgpt.png" alt="" />
          </div>
          <!-- 文字 -->
          <div class="text-2xl font-medium w-60">我今天能帮你做什么?</div>
        </div>
      </div>
    </el-scrollbar>
    <!-- 去到当前对话的顶部和底部 -->
    <div v-show="ShowButtonFlag" class="flex flex-col gap-1 absolute bottom-3 right-2">
      <div @click="GoToChatTop" class="GoToChat_TopOrBottom">
        <svg
          t="1707378937574"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1752"
          width="24"
          height="24">
          <path
            d="M828.21 690.33c4.5 4.5 10.6 7.03 16.97 7.03l95.2 0.01c7.13 0.01 10.71-8.62 5.66-13.66L523.01 260.68c-6.25-6.24-16.37-6.24-22.62 0L77.36 683.71c-5.05 5.04-1.47 13.67 5.66 13.66l95.2-0.01c6.37 0 12.47-2.53 16.97-7.03L511.7 373.82l316.51 316.51z"
            p-id="1753"
            fill="#444141"></path>
        </svg>
      </div>
      <div @click="GoToChatBottom" class="GoToChat_TopOrBottom">
        <svg
          t="1707379038594"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2396"
          width="24"
          height="24">
          <path
            d="M828.507 334.04c4.5-4.5 10.6-7.03 16.97-7.03l95.2-0.01c7.13-0.01 10.71 8.62 5.66 13.66l-423.03 423.03c-6.25 6.24-16.37 6.24-22.62 0L77.657 340.66c-5.05-5.04-1.47-13.67 5.66-13.66l95.2 0.01c6.37 0 12.47 2.53 16.97 7.03l316.51 316.51 316.51-316.51z"
            p-id="2397"
            fill="#444141"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
.GoToChat_TopOrBottom {
  @apply transition-all hover:bg-[#b4afaf88] cursor-pointer rounded-md p-1 active:scale-90;
}
</style>
