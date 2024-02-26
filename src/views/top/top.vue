<script setup>
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();
import { useGlobalInformationStore } from "@/stores/GlobalInformation.js";
let GlobalInformation = useGlobalInformationStore();
import { useRoute, useRouter } from "vue-router";
let $Route = useRoute();
let $Router = useRouter();

// 菜单栏 点击回调
const MenuBarClick = () => {
  // 判断处于什么状态 当浏览器视口宽度【小于767px 结果为true】 【大于767px 结果为false】
  if (ParametsSetting.w_phone) {
    // 抽屉形式{出现|消失} BottomLeft组件
    ParametsSetting.SliderBarDrawerFlag = true;
  } else {
    // 大屏幕 {出现|消失} BottomLeft组件
    ParametsSetting.ChangeBottomWidth();
  }
};
// 对话提示框 的 确认按钮的回调
const SureDeleteAllChat = () => {
  // 清空所有的对话信息
  GlobalInformation.ClearAllChatInfo();
  // 比如说，我在[/setting]页面 就不要返回 '/'
  // 判断当前的路径是否在聊天的页面
  if ($Route.fullPath.includes("/chat")) {
    // 在 就返回主页  作用：清空路径 清空ChatContainer的对话
    $Router.push("/chat");
  }
};
</script>

<template>
  <!-- rounded-t-3xl bg-rose-500 -->
  <div class="w-full h-[60px] border-b p-3 flex justify-between items-center maxd:h-[45px]">
    <div class="flex justify-evenly items-center">
      <!-- 侧边栏 -->
      <el-button link @click="MenuBarClick" class="transition-all active:scale-90">
        <SVG name="list"></SVG>
      </el-button>
      <!-- 清除全部的对话 -->
      <div
        class="tooltip maxd:tooltip-right transition-all active:scale-90"
        data-tip=" 删除所有的对话 ">
        <el-popconfirm
          width="200"
          :hide-icon="true"
          confirm-button-type="danger"
          title="确定要删除所有的对话吗?"
          @confirm="SureDeleteAllChat">
          <template #reference>
            <el-button link>
              <SVG name="broom"></SVG>
            </el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>

    <div class="w-28 maxd:w-24 flex justify-evenly items-center">
      <!-- setting -->
      <router-link to="/setting" class="transition-all active:scale-90">
        <el-button link>
          <SVG name="setting"></SVG>
        </el-button>
      </router-link>

      <!-- GitHub -->
      <el-button link>
        <a href="https://github.com/LSH160981/GraduationProject" target="_blank">
          <SVG name="github" width="28px" height="28px"></SVG>
        </a>
      </el-button>
    </div>
  </div>
</template>

<style scoped></style>
