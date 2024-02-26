<script setup>
import { ref, nextTick, watch } from "vue";
import { generateUUID } from "@/utils/GenerateUUID";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();

import { useCurrentChatInfoStore } from "@/stores/CurrentChatInfo.js";
let CurrentChatInfo = useCurrentChatInfoStore();

import { useRouter } from "vue-router";
let $Router = useRouter();

// ChatInput组件元素
const ChatInput = ref(null);
// 控制ChatInput组件的高度
watch(
  () => ParametsSetting.BottomRight_ChatInputHeight,
  (newValue) => {
    nextTick(() => {
      ChatInput.value.style.MinHeight = `79px`;
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

// 输入框的值
let InputValue = ref("");
// 发送按钮 点击事件
const SendButton = () => {
  // 如果 判断为真 说明正在发送网络请求 禁用 SendButton 函数
  if (CurrentChatInfo.ShowStopButtonFlag) {
    return;
  }
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
  let tempUUID;
  if (!CurrentChatInfo.uuid) {
    // 新建对话
    // 生成UUID
    tempUUID = generateUUID();
    CurrentChatInfo.ChangeUUID(tempUUID);
  }
  // 通过GPT获取回答
  CurrentChatInfo.GetGPTMsg(() => {
    // 让按钮消失
    CurrentChatInfo.ShowStopButtonFlag = false;
    // tempUUID有值  说明是新建对话，所以要改变当前的路由
    tempUUID && $Router.push(`/chat/${tempUUID}`);
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
  <div ref="ChatInput" class="w-full flex flex-col justify-evenly items-center">
    <!-- 不要让这个按钮 破坏下面的结果 -->
    <div class="relative -top-3">
      <div v-show="CurrentChatInfo.ShowStopButtonFlag">
        <!-- 重新生成按钮 -->
        <!-- 停止当前对话按钮 -->
        <el-button link @click="StopFetch">
          <div class="rounded-md flex justify-between items-center gap-1">
            <span>
              <SVG name="stop"></SVG>
            </span>
            <span> 停止当前对话 </span>
          </div>
        </el-button>
      </div>
      <div v-show="!CurrentChatInfo.ShowStopButtonFlag" class="h-[30px] w-[10px] maxd:h-5"></div>
    </div>

    <div class="w-full mb-2">
      <el-input
        v-model.lazy="InputValue"
        @keyup.enter="SendButton"
        v-focus
        size="large"
        placeholder="Enter 发送信息">
        <template #suffix>
          <button @click.stop="SendButton">
            <SVG name="send"></SVG>
          </button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style scoped></style>
