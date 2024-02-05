<script setup>
import Top from "@/views/top/top.vue";
import BottomLeft from "@/views/bottomLeft/bottomLeft.vue";
import BottomRight from "@/views/bottomRight/bottomRight.vue";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();
</script>

<template>
  <div
    class="w-screen h-screen max-w-[100vw] max-h-[100vh] flex justify-center items-center overflow-hidden">
    <div
      class="w-70vw h-83vh border-2 border-indigo-300 shadow-lg shadow-indigo-500/50 rounded-lg maxd:w-full maxd:h-full maxd:border-0">
      <!-- {{ ParametsSetting.w_phone }} -->
      <el-row>
        <el-col :span="24">
          <Top></Top>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :xs="0">
          <BottomLeft></BottomLeft>
        </el-col>
        <el-col :span="18" :xs="24">
          <BottomRight></BottomRight>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-drawer
    v-model="ParametsSetting.SliderBarDrawerFlag"
    size="75%"
    direction="ltr"
    :show-close="false"
    :with-header="false">
    <BottomLeft></BottomLeft>
  </el-drawer>
</template>

<style scoped></style>
