<script setup>
import { watch, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';

import ChatContainer from './chatContainer.vue';
import ChatInput from './chatInput.vue';

import { useRoute, useRouter } from 'vue-router';
let $Route = useRoute();
let $Router = useRouter();

import { useGlobalInformationStore } from '@/stores/GlobalInformation.js';
let GlobalInformation = useGlobalInformationStore();
import { useCurrentChatInfoStore } from '@/stores/CurrentChatInfo.js';
let CurrentChatInfo = useCurrentChatInfoStore();

// 路由变化 改变 CurrentChatInfo 的 UUID
let stopWatchRouteParams = watch(
  () => $Route.params,
  (newParams) => {
    //  路径没有带参数  再   判断本地有没有这个UUID
    if (newParams.uuid && GlobalInformation.AllUUID.includes(newParams.uuid)) {
      // 有的话直接读取 本地数据
      CurrentChatInfo.ChangeUUID(newParams.uuid);
    } else {
      // 下面的两种情况都要置空当前对话
      CurrentChatInfo.ChangeUUID('');

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
        type: 'warning',
      });
      // 返回 对应的路由
      $Router.push('/chat');
    }
  },
  { deep: true, immediate: true }
);

// 组件销毁
onBeforeUnmount(() => {
  // 停止对 路由变化 的监视
  stopWatchRouteParams();
});
</script>

<template>
  <div class="flex h-full w-full flex-col justify-between">
    <ChatContainer></ChatContainer>
    <ChatInput></ChatInput>
  </div>
</template>

<style scoped></style>
