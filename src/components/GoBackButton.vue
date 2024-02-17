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
        <svg
          t="1707725610910"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4193"
          width="24"
          height="24">
          <path
            d="M659.748571 245.272381l-51.687619-51.687619-318.439619 318.585905 318.415238 318.268952 51.712-51.736381-266.703238-266.556952z"
            p-id="4194"></path>
        </svg>
      </div>
      <span>返回</span>
    </div>
  </button>
</template>

<style scoped></style>
