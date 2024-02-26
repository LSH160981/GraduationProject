<script setup>
import { ref, onMounted, nextTick } from "vue";
import Top from "@/views/top/top.vue";
import BottomLeft from "@/views/bottomLeft/bottomLeft.vue";
import BottomRight from "@/views/bottomRight/bottomRight.vue";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();

// 背景的stars
let stars = ref([]);
onMounted(() => {
  nextTick(() => {
    function createStars(count) {
      let stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.floor(Math.random() * window.innerWidth),
          h: Math.random() * 60,
          duration: Math.random() * 7,
        });
      }
      return stars;
    }
    stars.value = createStars(100);
  });
});
</script>

<template>
  <div class="relative">
    <div class="scene">
      <template v-if="!ParametsSetting.w_phone">
        <i
          v-for="(star, index) in stars"
          :key="index"
          :style="{
            left: star.x + 'px',
            width: '1px',
            height: star.h + 'px',
            animationDuration: star.duration + 's',
          }"></i>
      </template>
    </div>
    <div
      class="absolute top-1/2 right-0 -translate-y-1/2 w-screen h-screen max-w-[100vw] max-h-[100vh] flex justify-center items-center overflow-hidden">
      <div
        class="w-70vw h-83vh border-2 bg-[var(--base-bgc)] border-indigo-300 shadow-lg shadow-indigo-500/50 rounded-lg maxd:w-full maxd:h-full maxd:border-0 maxd:rounded-none">
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
.scene {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(#220432, #190027);
  overflow: hidden;
}
.scene i {
  position: absolute;
  top: -250px;
  background: rgba(255, 255, 255, 0.5);
  animation: star-run linear infinite;
}
@keyframes star-run {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(200vh);
  }
}
</style>
