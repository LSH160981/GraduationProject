<script setup>
import { ElMessageBox } from 'element-plus';
import { useGlobalInformationStore } from '@/stores/GlobalInformation.js';
let GlobalInformation = useGlobalInformationStore();
import { useParametsSettingStore } from '@/stores/ParametsSetting.js';
let ParametsSetting = useParametsSettingStore();
import { useCurrentChatInfoStore } from '@/stores/CurrentChatInfo.js';
let { ChangeUUID } = useCurrentChatInfoStore();
import { useRoute, useRouter } from 'vue-router';
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
  if ($Route.fullPath.includes('/chat')) {
    // 在 就返回主页  作用：清空路径 清空ChatContainer的对话
    $Router.push('/chat');
  }
};
// 点击【broom-SVG】的回调-打开信息确认盒子
const openMessagePopup = async () => {
  // 如果没有数据 就不弹框
  if (GlobalInformation.AllChatInfo.length === 0) {
    return;
  }
  ElMessageBox.confirm('确定要删除所有的对话吗?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      // 点击确定回调
      console.log('sure');
      SureDeleteAllChat();
    })
    .catch(() => {
      // 点击取消回调
      console.log('canceled');
    });
};
// [在小屏幕的情况|和侧边栏消失] 才会升效的 新建对话 的按钮
const Limit_NewChat = () => {
  /**
   * 小屏幕时才会显示
   * BottomLeftWidth 只能等于6或者等于0 -> 在layout.vue文件中 决定 BottomLeft BottomRight 组件的宽占比 (el-plus的el-col)
   */
  if (ParametsSetting.w_phone || !ParametsSetting.BottomLeftWidth) {
    // 路由的跳转
    $Router.push(`/chat`);
    // 清除当前对话的uuid
    ChangeUUID('');
  }
};
// [在小屏幕的情况|和侧边栏消失] 才会升效的 选择面具 的按钮
const Limit_MaskPlay = () => {
  /**
   * 小屏幕时才会显示
   * BottomLeftWidth 只能等于6或者等于0 -> 在layout.vue文件中 决定 BottomLeft BottomRight 组件的宽占比 (el-plus的el-col)
   */
  if (ParametsSetting.w_phone || !ParametsSetting.BottomLeftWidth) {
    // 路由的跳转
    $Router.push(`/maskplay`);
  }
};
// setting 回调
const SettingClick = () => {
  $Router.push('/setting');
};
// GitHub 回调
const GitHubClick = () => {
  window.open('https://github.com/LSH160981/GraduationProject', '_blank');
};
</script>

<template>
  <!-- top -->
  <div class="flex h-[60px] w-full items-center justify-between border-b p-3 maxd:h-[45px]">
    <!-- top-left -->
    <div class="flex items-center justify-evenly">
      <!-- 侧边栏 -->
      <el-button link @click="MenuBarClick" class="transition-sca-90">
        <SVG name="list"></SVG>
      </el-button>
      <!-- 清除全部的对话 -->
      <div class="transition-sca-90 tooltip maxd:tooltip-right" data-tip=" 删除所有的对话 ">
        <el-button link @click="openMessagePopup">
          <SVG name="broom"></SVG>
        </el-button>
      </div>
    </div>
    <!-- top-right -->
    <div class="flex items-center justify-evenly">
      <!-- MaskPlay 小屏幕时才会显示 -->
      <!-- BottomLeftWidth 只能等于6或者等于0 -> 在layout.vue文件中 决定 BottomLeft BottomRight 组件的宽占比 (el-plus的el-col) -->
      <el-button
        link
        v-if="ParametsSetting.w_phone || !ParametsSetting.BottomLeftWidth"
        @click="Limit_MaskPlay"
        class="transition-sca-90">
        <SVG name="mask"></SVG>
      </el-button>
      <!-- New Chat 小屏幕时才会显示 -->
      <el-button
        link
        v-if="ParametsSetting.w_phone || !ParametsSetting.BottomLeftWidth"
        @click="Limit_NewChat"
        class="transition-sca-90">
        <SVG name="edit"></SVG>
      </el-button>
      <!-- setting -->
      <el-button link @click="SettingClick" class="transition-sca-90">
        <SVG name="setting"></SVG>
      </el-button>
      <!-- GitHub -->
      <el-button link @click="GitHubClick" class="transition-sca-90">
        <SVG name="github" width="28px" height="28px"></SVG>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
/* 因为使用这两个属性集合的元素太多啦 所以封装一下 */
.transition-sca-90 {
  @apply transition-all active:scale-90;
}
</style>
