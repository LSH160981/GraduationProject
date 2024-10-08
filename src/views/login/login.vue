<script setup>
import { ref, defineAsyncComponent } from 'vue';
const loginBg = defineAsyncComponent(() => import('./loginBg.vue'));
import { ElMessage, ElNotification } from 'element-plus';
import { SetToken } from '@/utils/HandlerToken.js';

import { useRouter } from 'vue-router'; // 引入路由
let $Router = useRouter(); // 实例化路由

let Account = ref('admin'); // 账号 admin
let Password = ref('123456'); // 密码 123456

/**
 * 全面添加遮罩层，并显示loading效果
 */
const fullscreenLoading = ref(false);

/**
 * 登录
 */
const SignIn = async () => {
  fullscreenLoading.value = true; // 开始loading
  let username = Account.value;
  let password = Password.value;
  if (!RuleVerification(username, password)) {
    fullscreenLoading.value = false; // 关闭loading效果
    ElMessage({
      message: '请输入正确的账号和密码',
      grouping: true,
      type: 'warning',
    });
    return;
  }

  // 模拟请求
  setTimeout(() => {
    // 保存 token
    SetToken('Token', 'Token-Test');
    // 路由跳到 对话页面
    $Router.push('/');
    // 提示成功信息
    ElNotification({
      type: 'success',
      duration: 2700,
      message: `登录成功`,
      title: `欢迎回来`,
    });
    // 关闭loading效果
    fullscreenLoading.value = false;
  }, 700);

  // try {
  //   let url = `${import.meta.env.VITE_APP_BASE_URL}/?account=${username}&password=${password}`;
  //   const response = await fetch(url);
  //   if (response.status === 200) {
  //     const result = await response.json();
  //     if (result.status === 200) {
  //       // 保存 token
  //       SetToken("Token", result.token);
  //       // 路由跳到 对话页面
  //       $Router.push("/chat");
  //       // 提示成功信息
  //       ElNotification({
  //         type: "success",
  //         duration: 2700,
  //         message: `登录成功`,
  //         title: `欢迎回来`,
  //       });
  //     } else if (result.status === 201) {
  //       // 提示失败信息
  //       ElMessage({
  //         message: "账号或密码错误",
  //         type: "error",
  //       });
  //     }
  //   }
  // } catch (error) {
  //   ElMessage({
  //     message: "请求失败，请稍后重试",
  //     type: "error",
  //   });
  // } finally {
  //   fullscreenLoading.value = false; // 关闭loading效果
  // }
};

/**
 * 对账号密码进行规则校验
 * @param {string} username - 需要校验的账号
 * @param {string} password - 需要校验的密码
 * @returns {boolean} 如果账号密码均满足规则则返回true，否则返回false
 */
const RuleVerification = (username, password) => {
  // 账号规则：长度5位以上，全部是英文，不能为空
  let usernameRule = /^[a-zA-Z]{5,}$/;
  // 密码规则：长度6位以上 全部是数字，不能为空
  let passwordRule = /^[0-9]{6,}$/;
  return usernameRule.test(username) && passwordRule.test(password);
};
</script>

<template>
  <div class="login h-screen w-screen select-none overflow-hidden">
    <div class="flex h-screen w-screen items-center justify-center">
      <div
        class="z-10 flex w-2/4 max-w-md flex-col rounded-lg border-2 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 p-6 shadow-lg shadow-indigo-500/50 maxd:w-5/6">
        <div class="mb-8 text-center">
          <h1 class="my-3 text-4xl font-bold">Sign in</h1>
          <p class="text-sm">Sign in to access your account</p>
        </div>
        <div class="space-y-12">
          <div class="space-y-4">
            <div class="py-3">
              <label
                class="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <input
                  v-model.trim="Account"
                  placeholder="Account"
                  class="sm:text-sm peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" />
                <span
                  class="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                  Account
                </span>
              </label>
            </div>
            <div>
              <label
                class="relative block overflow-hidden rounded-md border border-gray-200 px-3 pt-3 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <input
                  v-model.trim="Password"
                  type="password"
                  placeholder="Password"
                  @keydown.enter="SignIn"
                  class="sm:text-sm peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0" />
                <span
                  class="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
                  Password
                </span>
              </label>
            </div>
          </div>
          <div class="space-y-2">
            <div>
              <button
                v-loading.fullscreen.lock="fullscreenLoading"
                element-loading-text="Loading..."
                element-loading-background="#e4ecf794"
                @click="SignIn"
                class="w-full rounded-md bg-violet-400 px-8 py-3 font-semibold transition-all active:scale-95">
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loginBg></loginBg>
  </div>
</template>

<style scoped>
.login {
  background: linear-gradient(#000000, #200032);
}
</style>
