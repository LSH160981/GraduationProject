<script setup>
import { computed, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
let $Router = useRouter();
import prompts from "@/assets/prompts"; // 预设值
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();

// ElScrollbar组件元素
const El_Scrollbar = ref(null);

// 搜索框的值
let SearchInput = ref("");
// ProxyPrompts 等于 原始数据 + 搜索框的值
let ProxyPrompts = computed(() => {
  // 去到 El-Scrollbar 顶部
  nextTick(() => {
    El_Scrollbar.value.setScrollTop(0);
  });
  let results = [];
  let keyword = SearchInput.value;
  prompts.forEach((item) => {
    if (item[0].includes(keyword) || item[1].includes(keyword)) {
      results.push(item);
    }
  });
  return results;
});
// 为了后续的增加
prompts.unshift(["euwriout", "ewoiruuuuuuuuuuuu"]);

// 选择新的身份 与GPT对话
const ChoiceMaskChat = (maskStr) => {
  console.log(maskStr);
};

// 返回上一级
const GobackOne = () => {
  $Router.back();
};
</script>

<template>
  <!--  bg-violet-100 -->
  <div class="w-full h-full">
    <!-- 工具栏 -->
    <div class="flex justify-between items-center gap-1 px-2 pb-4">
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
      <!-- 搜索 -->
      <input
        v-model.trim="SearchInput"
        class="shadow appearance-none border rounded-xl w-[70%] h-11 maxd:h-8 py-2 px-3 text-gray-700 text-center leading-tight focus:outline-1"
        type="text"
        placeholder="搜索预设角色" />
      <!-- 新建 -->
      <button class="btn maxd:btn-sm">
        <div class="flex justify-start items-center cursor-pointer gap-1">
          <div>
            <svg
              t="1707726966085"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6397"
              width="24"
              height="24">
              <path
                d="M512 938.667c-235.264 0-426.667-191.424-426.667-426.645 0-235.264 191.403-426.688 426.667-426.688 235.243 0 426.667 191.424 426.667 426.688 0 235.221-191.424 426.645-426.667 426.645zM512 128c-211.733 0-384 172.267-384 384.021 0 211.733 172.267 383.979 384 383.979s384-172.245 384-383.979c0-211.755-172.267-384.021-384-384.021z"
                p-id="6398"></path>
              <path d="M490.667 277.333l42.667 0 0 469.333-42.667 0 0-469.333z" p-id="6399"></path>
              <path d="M277.333 490.667l469.333 0 0 42.667-469.333 0 0-42.667z" p-id="6400"></path>
            </svg>
          </div>
          <span>新建</span>
        </div>
      </button>
    </div>
    <!-- 主体  -->
    <el-scrollbar ref="El_Scrollbar" :max-height="ParametsSetting.BottomHeight * 0.8">
      <div v-for="item in ProxyPrompts" class="border-2 rounded-lg shadow-md mb-3 cursor-pointer">
        <div class="p-2 flex flex-col" @click="ChoiceMaskChat(item[1])">
          <!-- title -->
          <span class="text-2xl font-normal whitespace-nowrap w-60 text-black">{{ item[0] }}</span>
          <!-- content -->
          <span class="truncate">
            {{ item[1] }}
          </span>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped></style>
