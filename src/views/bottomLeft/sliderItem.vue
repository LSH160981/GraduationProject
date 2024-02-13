<script setup>
import { ref, computed } from "vue";
import { EditPen, Delete } from "@element-plus/icons-vue";
import { useCurrentChatInfoStore } from "@/stores/currentChatInfo.js";
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
  }
};
// SliderItem 点击之后 通过TWCSS改变背景颜色
const SliderItemChangeBGC = ($event, uuid) => {
  $event.target.classList.remove("bg-gray-100");
  // 获取所有带有 'uuid' 属性的元素
  let elements = document.querySelectorAll("[uuid]");
  // 遍历元素并打印 uuid
  elements.forEach((element) => {
    let element_uuid = element.getAttribute("uuid");
    element.classList.remove("bg-gray-300");
    if (element_uuid === uuid) {
      element.classList.add("bg-gray-300");
    }
  });
};
// SliderItem 鼠标进入之后 触发的回调
const SliderItemMouseEnter = ($event) => {
  // console.log($event.target);
  if (!$event.target.classList.contains("bg-gray-300")) {
    $event.target.classList.add("bg-gray-100");
  }
};
// SliderItem 鼠标离开之后 触发的回调
const SliderItemMouseLeave = ($event) => {
  $event.target.classList.remove("bg-gray-100");
};
// SliderItem 点击之后 触发的回调
const SliderItemClick = ($event, uuid) => {
  // 改BGC
  SliderItemChangeBGC($event, uuid);
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
  <!-- bg-gray-300  hover:bg-gray-200-->
  <!-- 添加自定义属性[uuid]     -->
  <div
    :uuid="ChatInfo.uuid"
    class="bg-[#fff] shadow-md mb-2 flex justify-between items-center p-3 rounded-lg cursor-pointer"
    @mouseenter="SliderItemMouseEnter"
    @mouseleave="SliderItemMouseLeave"
    @click.self="SliderItemClick($event, ChatInfo.uuid)">
    <span
      v-if="!ReNameFlag"
      @click.self="SliderItemClick($event, ChatInfo.uuid)"
      class="truncate selection:bg-sky-300">
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
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <button>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#ccc"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12Z"
              fill="currentColor"></path>
          </svg>
        </button>
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
</style>
