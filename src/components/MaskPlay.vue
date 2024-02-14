<script setup>
import { computed, ref, nextTick, watch, toRaw, onMounted } from "vue";
import { generateUUID } from "@/utils/GenerateUUID";
import { ElMessage } from "element-plus";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();
import { useCurrentChatInfoStore } from "@/stores/currentChatInfo.js";
let CurrentChatInfo = useCurrentChatInfoStore();

import { useRouter } from "vue-router";
let $Router = useRouter();

import masks from "@/assets/masks"; // 预设角色
let CopyMasks = ref(masks); // 把这些提前准备好的预设角色 变为响应式的
let UserAddMasks = ref([]); // 用户添加的
/**
 * UserAddMasks 变化
 * 就要保存到本地 方便日后读取
 */
watch(
  () => UserAddMasks.value,
  () => {
    // 把数据保存到本地
    localStorage.setItem("UserAddMasks", JSON.stringify(toRaw(UserAddMasks.value)));
  },
  {
    deep: true,
  }
);
// 页面加载完成时 先看看本地有没有存储，有的话合并
onMounted(() => {
  let LocalUserMasks = localStorage.getItem("UserAddMasks");
  let result = LocalUserMasks ? JSON.parse(LocalUserMasks) : [];
  CopyMasks.value = [...result, ...CopyMasks.value];
  UserAddMasks.value = result; // 读取本地的值，没有就算了
});
// 根据时间戳删除 mask 自带的不删除
const DeleteUserMask = (number) => {
  UserAddMasks.value = UserAddMasks.value.filter((item) => {
    if (item[2]) {
      return item[2] !== number;
    }
  });
  CopyMasks.value = CopyMasks.value.filter((item) => {
    if (item[2]) {
      return item[2] !== number;
    }
    return item;
  });
};

// ElScrollbar组件元素
const El_Scrollbar = ref(null);

// 搜索框的值
let SearchInput = ref("");
// ProxyMasks 等于 原始数据 + 搜索框的值
let ProxyMasks = computed(() => {
  // 去到 El-Scrollbar 顶部
  nextTick(() => {
    El_Scrollbar.value.setScrollTop(0);
  });
  let results = [];
  let keyword = SearchInput.value;
  CopyMasks.value.forEach((item) => {
    if (item[0].includes(keyword) || item[1].includes(keyword)) {
      results.push(item);
    }
  });
  return results;
});
// 选择新的身份 与GPT对话
const ChoiceMaskChat = (maskStr) => {
  // 允许改标题
  CurrentChatInfo.changeTltleFlag = true;
  // 生成UUID
  let G_UUID = generateUUID();
  // 改 当前对话的UUID
  CurrentChatInfo.ChangeUUID(G_UUID);
  // 添加 当前对话的 系统提示词
  CurrentChatInfo.messages.push({
    role: "system",
    content: maskStr,
  });
  // 路由的跳转
  $Router.push(`/chat/${G_UUID}`);
};
// 返回上一级
const GobackOne = () => {
  $Router.back();
};

// 控制 添加新的预设角色 的对话框
let DialogVisible = ref(false);
// 对话框的宽
let DialogWidth = computed(() => {
  if (ParametsSetting.w_phone) {
    return "85%";
  } else {
    return "50%";
  }
});
// 添加新角色的标题
let DialogTitle = ref("");
// 添加新角色的描述
let DialogContent = ref("");
// 对话框确认按钮的回调
const DialogSure = () => {
  let temp_tit = DialogTitle.value.trim();
  let temp_con = DialogContent.value.trim();
  if (temp_tit && temp_con) {
    // 自定义的角色有时间戳
    let temp_arr = [temp_tit, temp_con, new Date().getTime()];
    // 加到展示的地方
    CopyMasks.value.unshift(temp_arr);
    // 保存到本地
    UserAddMasks.value.unshift(temp_arr);
    // 关闭Dialog
    DialogVisible.value = false;
    // 置空 两个值
    DialogTitle.value = "";
    DialogContent.value = "";
  } else {
    ElMessage({
      message: "标题 和 预设角色的描述 必须填写",
      type: "warning",
    });
  }
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
        v-focus
        class="shadow appearance-none border rounded-xl w-[70%] h-11 maxd:h-8 py-2 px-3 text-gray-700 text-center leading-tight focus:outline-1"
        type="text"
        placeholder="搜索预设角色" />
      <!-- 新建 -->
      <button class="btn maxd:btn-sm" @click="DialogVisible = true">
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
    <el-scrollbar ref="El_Scrollbar" :max-height="ParametsSetting.BottomHeight * 0.85">
      <div
        v-for="item in ProxyMasks"
        :key="item[0]"
        class="relative border-2 rounded-xl shadow-md mb-3 cursor-pointer">
        <div class="p-3 flex flex-col hover:bg-violet-100" @click="ChoiceMaskChat(item[1])">
          <!-- title -->
          <span class="text-2xl font-normal whitespace-nowrap w-60 text-black">
            {{ item[0] }}
          </span>
          <!-- content -->
          <span class="truncate">
            {{ item[1] }}
          </span>
        </div>
        <!-- 只有自定义添加的角色才会 显示 删除按钮 -->
        <button
          v-if="item[2]"
          @click="DeleteUserMask(item[2])"
          class="w-16 h-11 rounded-md mr-5 bg-rose-300 transition-all absolute top-1/2 right-0 -translate-y-1/2 hover:bg-rose-500 active:scale-90">
          删除
        </button>
      </div>
    </el-scrollbar>
    <!-- 添加新的预设角色 的 dialog -->
    <el-dialog v-model="DialogVisible" title="添加新的预设角色" :width="DialogWidth" align-center>
      <div class="flex flex-col gap-3">
        <el-input v-focus v-model="DialogTitle" size="large" placeholder="标题" clearable />
        <el-input
          type="textarea"
          v-model="DialogContent"
          :autosize="{ minRows: 4, maxRows: 6 }"
          maxlength="2000"
          show-word-limit
          placeholder="预设角色的描述！" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="DialogVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="DialogSure"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>