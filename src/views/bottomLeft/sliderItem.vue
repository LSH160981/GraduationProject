<script setup>
import { ref, computed } from "vue";
import { EditPen, Delete } from "@element-plus/icons-vue";
import { useCurrentChatInfoStore } from "@/stores/CurrentChatInfo.js";
let CurrentChatInfo = useCurrentChatInfoStore();
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();
import { useRouter } from "vue-router";
let $Router = useRouter();

// 父组件传递的 数据
const { ChatInfo } = defineProps({
  ChatInfo: {
    require: true,
  },
});
// 父组件传递的事件
const $Emit = defineEmits(["DeleteMsg", "ChangeTitle"]);

// 为了不打破单项数据流 使用computed处理 ChatInfo.title
let ComputedTitle = computed({
  get() {
    return ChatInfo.title;
  },
  set(newValue) {
    $Emit("ChangeTitle", ChatInfo.uuid, newValue);
  },
});
// chat改标题 false显示span,true显示input
let ReNameFlag = ref(false);
// 根据UUID  重命名 对话的标题
const ReName = () => {
  ReNameFlag.value = true;
};
// 根据UUID  删除 该对话
const DeleteMsg = () => {
  $Emit("DeleteMsg", ChatInfo.uuid);
  // 判断删除的是不是当前对话
  if (ChatInfo.uuid === CurrentChatInfo.uuid) {
    // 置空当前对话的UUID
    CurrentChatInfo.ChangeUUID("");
    // 返回 对应的路由
    $Router.push("/chat");
    // 关闭 Drawer
    ParametsSetting.SliderBarDrawerFlag = false;
  }
};

// SliderItem 点击之后 触发的回调
const SliderItemClick = () => {
  // 改 Border
  CurrentChatInfo.SliderItemChangeBorder();
  // 1.通知兄弟组件 并把UUID传过去
  // CurrentChatInfo.ChangeUUID(uuid);
  // 2.如果 w_phone为真的话 还要把 el-drawer 关掉
  if (ParametsSetting.w_phone) {
    ParametsSetting.SliderBarDrawerFlag = false;
  }
};

// 保存 ComputedTitle  的临时数据
let TempData_title = ref("");
// input 获得焦点 的回调
const InputFocus = () => {
  // 聚焦时 保存数据
  TempData_title.value = ComputedTitle.value;
};
// input 失去焦点 的回调
const InputBlur = () => {
  // 判断数据是否为空
  if (!ComputedTitle.value) {
    // 空的话 把临时数据 改回去
    ComputedTitle.value = TempData_title.value;
  }
  // 显示span
  ReNameFlag.value = false;
  // 置空 TempData_title
  TempData_title.value = "";
};

// 这个指令(v-focus)已经被注册为全局指令 下面的注释，仅仅留作参考
// 在模板中启用 v-focus 在 <script setup> 中 任何以 v 开头的驼峰式命名的变量都可以被用作一个自定义指令
// const vFocus = {
//   mounted: (el) => {
//     let input = el.querySelector("input");
//     // 这个30毫秒是适配移动端
//     setTimeout(() => {
//       nextTick(() => {
//         input.focus(); // 原生聚焦
//       });
//     }, 30);
//   },
// };
</script>

<template>
  <div
    :uuid="ChatInfo.uuid"
    class="mb-2 p-3 box-border border-2 bg-white hover:bg-gray-300 shadow-md flex justify-between items-center rounded-lg cursor-pointer transition-all active:scale-95"
    @click.self="SliderItemClick">
    <span
      v-if="!ReNameFlag"
      @click.self="SliderItemClick"
      class="truncate selection:bg-sky-300 text-[color:var(--base-textColor)]">
      {{ ComputedTitle }}
    </span>
    <el-input
      v-else
      v-model.trim="ComputedTitle"
      class="h-[26px] text-xs"
      v-focus
      clearable
      @focus="InputFocus"
      @blur="InputBlur"
      @keyup.enter="InputBlur" />
    <el-dropdown trigger="hover">
      <span class="el-dropdown-link">
        <div class="tooltip transition-sca-90" data-tip="选项">
          <SVG name="more" :FixedColor="`#000`"></SVG>
        </div>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :icon="EditPen" @click="ReName()">
            <span>重命名</span>
          </el-dropdown-item>
          <el-dropdown-item :icon="Delete" @click="DeleteMsg()">
            <span class="text-red-600">删除</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<style scoped>
.el-dropdown-link:focus-visible {
  outline: unset;
}
div.el-input__wrapper {
  background-color: transparent;
}
input.el-input__inner {
  color: #000;
}
</style>
