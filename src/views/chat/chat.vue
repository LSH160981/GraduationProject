<script setup>
import { watch } from "vue";
import { ElMessage } from "element-plus";

import ChatContainer from "./chatContainer.vue";
import ChatInput from "./chatInput.vue";

import { useRoute, useRouter } from "vue-router";
let $Route = useRoute();
let $Router = useRouter();

import { useGlobalInformationStore } from "@/stores/GlobalInformation.js";
let GlobalInformation = useGlobalInformationStore();
import { useCurrentChatInfoStore } from "@/stores/CurrentChatInfo.js";
let CurrentChatInfo = useCurrentChatInfoStore();

// 路由变化 改变 CurrentChatInfo 的 UUID
watch(
  () => $Route.params,
  (newParams) => {
    //  路径没有带参数  再   判断本地有没有这个UUID
    if (newParams.uuid && GlobalInformation.AllUUID.includes(newParams.uuid)) {
      // 有的话直接读取 本地数据
      CurrentChatInfo.ChangeUUID(newParams.uuid);
    } else {
      // 下面的两种情况都要置空当前对话
      CurrentChatInfo.ChangeUUID("");

      // 进入这里有两种情况
      // 1. 没有 带参数 默认新对话
      if (!newParams.uuid) {
        return;
      }
      // 2. 有参数但是 无效
      // 提示用户
      ElMessage({
        message: `无法加载对话 ${newParams.uuid}`,
        grouping: true,
        type: "warning",
      });
      // 返回 对应的路由
      $Router.push("/chat");
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between">
    <ChatContainer></ChatContainer>
    <ChatInput></ChatInput>
  </div>
</template>

<style scoped></style>
