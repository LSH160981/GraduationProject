<script setup>
import { ref, nextTick, watch } from "vue";
import { generateUUID } from "@/utils/GenerateUUID";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();

import { useCurrentChatInfoStore } from "@/stores/currentChatInfo.js";
let CurrentChatInfo = useCurrentChatInfoStore();

// ChatInput组件元素
const ChatInput = ref(null);
// 控制ChatInput组件的高度
watch(
  () => ParametsSetting.BottomRight_ChatInputHeight,
  (newValue) => {
    nextTick(() => {
      ChatInput.value.style.height = `${newValue}px`;
    });
  },
  {
    immediate: true,
  }
);

// 检测 CurrentChatInfo.controller 如果为空,说明网络 中断了 按钮也要消失
watch(
  () => CurrentChatInfo.controller,
  (newValue) => {
    if (newValue === null) {
      // 进入这个判断说明 GPT发送的网络请求中断了  | 或者压根就没有发送过请求
      // 无论是哪一种，都要让按钮消失
      // 让按钮消失
      CurrentChatInfo.ShowStopButtonFlag = false;
    }
  },
  {
    deep: true,
  }
);

// 控制 当前对话的终止
// let stopHandler = null;
// 输入框的值
let InputValue = ref("");
// 发送按钮 点击事件
const SendButton = () => {
  // 简单的校验
  if (!InputValue.value.trim()) {
    return;
  }
  // 显示 停止按钮
  CurrentChatInfo.ShowStopButtonFlag = true;
  // 添加数据到  CurrentChatInfoStore
  CurrentChatInfo.UserQuestion(InputValue.value);
  // 置空
  InputValue.value = "";
  if (!CurrentChatInfo.uuid) {
    CurrentChatInfo.ChangeUUID(generateUUID());
  }

  CurrentChatInfo.GetGPTMsg(() => {
    // 让按钮消失
    CurrentChatInfo.ShowStopButtonFlag = false;
  });
};

// 停止当前对话
const StopFetch = () => {
  // 1.如果用户直接点的话
  if (!CurrentChatInfo.controller) {
    return;
  }
  // 2.当你调用了 controller.abort() 函数后, signal.aborted 属性的值将会变为 true。
  if (CurrentChatInfo.signal.aborted) {
    // console.log("AbortController has been used.");
    return;
  }
  // 让网络请求停止
  CurrentChatInfo.controller.abort();
  // 让按钮消失
  CurrentChatInfo.ShowStopButtonFlag = false;
};
</script>

<template>
  <!-- bg-violet-100 -->
  <div ref="ChatInput" class="w-full flex flex-col justify-between items-center">
    <!-- 不要让这个按钮 破坏下面的结果 -->
    <div class="relative -top-3">
      <div v-show="CurrentChatInfo.ShowStopButtonFlag">
        <el-button link @click="StopFetch">
          <div class="rounded-md flex justify-between items-center gap-1">
            <span>
              <svg
                t="1707380852288"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2527"
                width="24"
                height="24">
                <path
                  d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024z m3.008-92.992a416 416 0 1 0 0-832 416 416 0 0 0 0 832zM320 320h384v384H320V320z"
                  fill="#262626"
                  p-id="2528"></path>
              </svg>
            </span>
            <span> 停止当前对话 </span>
          </div>
        </el-button>
      </div>
      <div v-show="!CurrentChatInfo.ShowStopButtonFlag" class="h-[30px] w-[10px]"></div>
    </div>

    <div class="w-full mb-2">
      <el-input
        v-model.lazy="InputValue"
        @keyup.enter="SendButton"
        size="large"
        placeholder="我今天能帮你什么?">
        <template #suffix>
          <button @click.stop="SendButton">
            <svg
              t="1706885107174"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4259"
              width="24"
              height="24">
              <path
                d="M85.333333 896l896-384L85.333333 128v298.666667l640 85.333333-640 85.333333z"
                p-id="4260"
                fill="#1296db"></path>
            </svg>
          </button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style scoped></style>
