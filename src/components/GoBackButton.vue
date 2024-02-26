<script setup>
import { useRouter } from "vue-router";
let $Router = useRouter();
// 返回上一级
const GobackOne = () => {
  $Router.back();
};
</script>

<template>
  <!-- 返回 -->
  <button class="btn maxd:btn-sm" @click="GobackOne">
    <div class="flex justify-start items-center cursor-pointer">
      <div>
        <SVG name="left"></SVG>
      </div>
      <span>返回</span>
    </div>
  </button>
</template>

<style scoped></style>
