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

// 控制 当前对话的终止
let stopHandler = null;
// 输入框的值
let InputValue = ref("");
// 发送按钮 点击事件
const SendButton = () => {
  // 简单的校验
  if (!InputValue.value.trim()) {
    return;
  }
  // 添加数据到  CurrentChatInfoStore
  CurrentChatInfo.UserQuestion(InputValue.value);
  // 置空
  InputValue.value = "";
  if (!CurrentChatInfo.uuid) {
    CurrentChatInfo.ChangeUUID(generateUUID());
  }

  // stopHandler = CurrentChatInfo.GetGPTMsg();
};

// 停止当前对话
const StopFetch = () => {
  stopHandler.abort();
};
</script>

<template>
  <!-- bg-violet-100 -->
  <div ref="ChatInput" class="w-full flex flex-col justify-between">
    <!-- 一些功能 -->
    <div class="flex justify-start gap-2 md:mt-1 md:ml-2">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="指定system的扮演的角色"
        placement="top-start">
        <el-button link>
          <svg
            t="1706961104434"
            class="icon"
            viewBox="0 0 1861 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="5417"
            width="32"
            height="32">
            <path
              d="M1739.17467721 98.36081651s-56.60364199 77.04984815-373.54208818-27.45651622c-150.27358008-34.83545449-308.30743916 40.04075303-442.78716622 95.8753582-134.84835703-54.4617791-293.27626758-128.25116631-443.38460097-92.15728769C163.40581529 181.75998448 106.35092086 105.22494599 106.35092086 105.22494599s-54.65880528 744.3258126 459.65512793 849.41054297c156.05088838 40.04075303 257.30950253-96.21856406 358.90496807-96.60626015s203.76294082 134.74031045 359.47062334 93.64451572c513.7165002-109.44472412 454.5642331-853.31292715 454.56423222-853.31292802z m-894.29431992 488.68785175S424.35711949 784.57033672 316.73647476 351.65353291l205.45990664-3.08885801a309.61035263 309.61035263 0 0 1 322.62677491 238.47763799z m684.86847275-235.39513535c-107.54437676 432.91680381-528.15659326 235.38877998-528.15659414 235.38877998a309.66755362 309.66755362 0 0 1 322.6267749-238.47763799l205.45990664 3.08885801z"
              p-id="5418"
              fill="#1296db"></path>
          </svg>
        </el-button>
      </el-tooltip>
      <el-tooltip class="box-item" effect="dark" content="停止当前对话" placement="top-start">
        <el-button link @click="StopFetch">
          <svg
            t="1706961830631"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="7031"
            width="28"
            height="28">
            <path
              d="M648.192 332.8c-44.032-7.168-89.088-10.24-136.192-10.24-48.128 0-93.184 3.072-136.192 10.24-22.528 3.072-38.912 20.48-43.008 43.008-7.168 44.032-10.24 89.088-10.24 136.192 0 48.128 3.072 93.184 10.24 136.192v2.048c5.12 19.456 20.48 35.84 40.96 40.96h2.048c44.032 7.168 89.088 10.24 136.192 10.24 48.128 0 93.184-3.072 136.192-10.24 22.528-3.072 38.912-20.48 43.008-43.008 7.168-44.032 10.24-89.088 10.24-136.192 0-48.128-3.072-93.184-10.24-136.192-4.096-22.528-20.48-38.912-43.008-43.008z m2.048 309.248c-1.024 4.096-4.096 8.192-8.192 8.192-40.96 7.168-83.968 10.24-130.048 10.24-45.056 0-87.04-3.072-129.024-10.24-4.096-1.024-8.192-5.12-10.24-10.24-6.144-40.96-10.24-82.944-10.24-129.024 0-45.056 3.072-88.064 10.24-130.048 1.024-4.096 4.096-8.192 8.192-8.192 40.96-7.168 83.968-10.24 130.048-10.24 45.056 0 88.064 3.072 130.048 10.24 4.096 1.024 8.192 4.096 8.192 8.192 7.168 40.96 10.24 83.968 10.24 130.048 1.024 46.08-2.048 89.088-9.216 131.072zM512 51.2C258.048 51.2 51.2 258.048 51.2 512s206.848 460.8 460.8 460.8 460.8-206.848 460.8-460.8S765.952 51.2 512 51.2z m0 880.64C280.576 931.84 92.16 743.424 92.16 512S280.576 92.16 512 92.16s419.84 188.416 419.84 419.84-188.416 419.84-419.84 419.84z"
              p-id="7032"
              fill="#1296db"></path>
          </svg>
        </el-button>
      </el-tooltip>
    </div>
    <div>
      <el-input
        v-model.lazy="InputValue"
        @keyup.enter="SendButton"
        size="large"
        placeholder="我今天能帮你什么?">
        <template #suffix>
          <button @click="SendButton">
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
