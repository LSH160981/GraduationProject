<script setup>
// 在Vue3中 setup 的运行时机是最早的
// console.log(import.meta.env.VITE_APP_BASE_URL);
// import { GetToken, VerifyToken } from "@/utils/HandlerToken.js";
// 验证token是否有效
// VerifyToken(GetToken("Token"));
</script>

<template>
  <!-- 一级路由出口 -->
  <RouterView />
</template>

<style scoped></style>
