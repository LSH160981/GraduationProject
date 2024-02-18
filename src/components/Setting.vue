<script setup>
import { ref } from "vue";
import RangeInput from "./RangeInput.vue";
import GoBackButton from "./GoBackButton.vue";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();
// import { useGPTSettingStore } from "@/stores/GPTSetting.js";
// let GPTSetting = useGPTSettingStore();

// 记录选择的模型
let Model = ref("gpt-3.5-turbo");
// 模型 选择的回调
const ChooseModel = (m) => {
  Model.value = m;
};

// 随机性 值越大，回复越随机
let Temperature = ref(0.5);
// 改变 随机值的函数
let ChangeTemperature = (e) => {
  Temperature.value = +e.target.value;
};
</script>

<template>
  <!-- bg-rose-50 -->
  <div class="w-full h-full select-none">
    <!-- top -->
    <div class="mb-3 flex justify-between items-center gap-1 px-2 pb-4">
      <GoBackButton />
      <span class="text-2xl">GPT参数设置</span>
    </div>
    <!-- 主体  -->
    <el-scrollbar :max-height="ParametsSetting.BottomHeight * 0.85">
      <div class="w-full">
        <!-- 第一项 模型 -->
        <div class="px-5 py-3 flex justify-between items-center border rounded-tl-xl rounded-tr-xl">
          <span class="text-base font-bold">模型 (model)</span>
          <el-dropdown trigger="click" class="h-9" @command="ChooseModel">
            <span class="min-w-36 flex justify-evenly items-center rounded-xl border p-3">
              {{ Model }}
              <svg
                t="1708079813734"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4194"
                width="24"
                height="24">
                <path
                  d="M512.146286 619.52L245.296762 352.792381 193.584762 404.48l318.585905 318.415238 318.268952-318.415238-51.736381-51.687619z"
                  p-id="4195"></path>
              </svg>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="gpt-3.5-turbo"> gpt-3.5-turbo </el-dropdown-item>
                <el-dropdown-item command="GPT-3.5-Turbo-16K"> GPT-3.5-Turbo-16K </el-dropdown-item>
                <el-dropdown-item command="gpt-4"> gpt-4 </el-dropdown-item>
                <el-dropdown-item command="tts-1"> tts-1 </el-dropdown-item>
                <el-dropdown-item command="dall-e-3"> dall-e-3 </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- 第二项 随机性 -->
        <div class="px-5 py-3 flex justify-between items-center border border-t-0">
          <div>
            <div class="text-base font-bold">随机性 (temperature)</div>
            <div class="text-xs">值越大，回复越随机</div>
          </div>
          <RangeInput
            :value="Temperature"
            :min="0"
            :max="2"
            :step="0.1"
            @input="ChangeTemperature" />
        </div>
      </div>
    </el-scrollbar>

    <!-- <RangeInput /> -->
  </div>
</template>

<style scoped></style>
