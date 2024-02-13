<script setup>
import { ref, watch, nextTick } from "vue";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
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
    <!-- 二级路由出口 -->
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
