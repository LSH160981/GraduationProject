<script setup>
import { ref, nextTick, watch, onBeforeUnmount } from "vue";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();

import { useCurrentChatInfoStore } from "@/stores/CurrentChatInfo.js";
let CurrentChatInfo = useCurrentChatInfoStore();

// ChatContainer组件元素
const ChatContainer = ref(null);
// ElScrollbar组件元素
const El_Scrollbar = ref(null);

// 控制ChatContainer组件的高度 ---> 只要浏览器视口不变
let stopWatchChatContainer = watch(
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
let stopWatchCurrentChatInfoMessages = watch(
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

// 组件销毁
onBeforeUnmount(() => {
  // 停止对 组件 的监视
  stopWatchChatContainer();
  // 停止对 CurrentChatInfo.messages 的变化 的监视
  stopWatchCurrentChatInfoMessages();
});
</script>

<template>
  <!-- ChatContainer class="bg-red-100" -->
  <div
    ref="ChatContainer"
    class="relative w-full h-full overflow-x-hidden"
    @mouseenter="Show_Up_Down_Button"
    @mouseleave="ShowButtonFlag = false">
    <!-- :max-height="ParametsSetting.BottomRight_ChatContainerHeight" -->
    <el-scrollbar ref="El_Scrollbar" class="w-full">
      <div v-if="CurrentChatInfo.messages.length" class="w-full">
        <div v-for="(item, index) in CurrentChatInfo.messages" :key="index" class="w-full">
          <div v-if="item.role === 'system'" class="w-full chat chat-start">
            <div class="w-auto chat-bubble chat-bubble-accent">
              <v-md-preview :text="item.content" indeasdasd="hiouwhdoui"></v-md-preview>
            </div>
          </div>
          <div v-else-if="item.role === 'user'" class="w-full chat chat-end">
            <div class="w-auto chat-bubble chat-bubble-info">
              <v-md-preview :text="item.content" indeasdasd="hiouwhdoui"></v-md-preview>
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
          <div class="text-2xl font-medium w-60 text-[color:var(--setting-color)]">
            我今天能帮你做什么?
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- 去到当前对话的顶部和底部 -->
    <div v-show="ShowButtonFlag" class="flex flex-col gap-1 absolute bottom-3 right-2">
      <div @click="GoToChatTop" class="GoToChat_TopOrBottom">
        <SVG name="top"></SVG>
      </div>
      <div @click="GoToChatBottom" class="GoToChat_TopOrBottom">
        <SVG name="bottom"></SVG>
      </div>
    </div>
  </div>
</template>

<style scoped>
.GoToChat_TopOrBottom {
  @apply transition-all hover:bg-[#b4afaf88] cursor-pointer rounded-md p-1 active:scale-90;
}
</style>
