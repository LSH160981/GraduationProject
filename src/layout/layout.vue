<script setup>
import { defineAsyncComponent } from 'vue';
const layoutBg = defineAsyncComponent(() => import('./layoutBg.vue'));
import Top from '@/views/top/top.vue';
import BottomLeft from '@/views/bottomLeft/bottomLeft.vue';
import BottomRight from '@/views/bottomRight/bottomRight.vue';
import { useParametsSettingStore } from '@/stores/ParametsSetting.js';
let ParametsSetting = useParametsSettingStore();

const version_info = window.$AppVersion;
</script>

<template>
  <!-- layout -->
  <div class="layout" :version_info="`v${version_info}`">
    <div class="flex h-screen max-h-[100vh] w-screen max-w-[100vw] items-center justify-center overflow-hidden">
      <div
        class="h-83vh w-70vw rounded-lg border-2 border-indigo-300 bg-[var(--base-bgc)] shadow-lg shadow-indigo-500/50 maxd:h-full maxd:w-full maxd:rounded-none maxd:border-0">
        <el-row>
          <el-col :span="24">
            <Top></Top>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="ParametsSetting.BottomLeftWidth" :xs="0">
            <BottomLeft></BottomLeft>
          </el-col>
          <el-col :span="ParametsSetting.BottomRightWidth" :xs="24">
            <BottomRight></BottomRight>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 如果是小屏幕 就不要显示了 -->
    <layoutBg v-if="!ParametsSetting.w_phone"></layoutBg>
  </div>
  <!-- 只有 小屏幕模式下 才会启用的 抽屉组件 -->
  <el-drawer
    v-model="ParametsSetting.SliderBarDrawerFlag"
    size="75%"
    direction="ltr"
    :show-close="false"
    :with-header="false">
    <BottomLeft></BottomLeft>
  </el-drawer>
</template>

<style scoped>
.layout {
  @apply relative;
}

.layout::after {
  content: attr(version_info); /* 对应的内容 */
  @apply absolute bottom-0 right-0 -z-10 select-none text-sm text-gray-400;
}
</style>
