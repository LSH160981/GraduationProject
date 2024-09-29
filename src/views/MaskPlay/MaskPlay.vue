<script setup>
import { computed, ref, nextTick, watch, toRaw, onMounted, onBeforeUnmount } from 'vue';
import { generateUUID } from '@/utils/GenerateUUID.js';
import { ElMessage } from 'element-plus';
import { useParametsSettingStore } from '@/stores/ParametsSetting.js';
let ParametsSetting = useParametsSettingStore();
import { useCurrentChatInfoStore } from '@/stores/CurrentChatInfo.js';
let CurrentChatInfo = useCurrentChatInfoStore();
import { useRouter } from 'vue-router';
let $Router = useRouter();
// 返回上一级
const GobackOne = () => {
  $Router.back();
};

import masks from '@/assets/JSON/masks'; // 预设角色
let CopyMasks = ref([...masks]); // 把这些提前准备好的预设角色 变为响应式的   展示在页面的数据
let UserAddMasks = ref([]); // 用户添加的
/**
 * UserAddMasks 变化
 * 就要保存到本地 方便日后读取
 */
let stopWatchUserAddMasks = watch(
  () => UserAddMasks.value,
  () => {
    // 把数据保存到本地
    localStorage.setItem('UserAddMasks', JSON.stringify(toRaw(UserAddMasks.value)));
  },
  {
    deep: true,
  }
);
// 页面加载完成时 先看看本地有没有存储，有的话合并
onMounted(() => {
  let LocalUserMasks = localStorage.getItem('UserAddMasks');
  let result = LocalUserMasks ? JSON.parse(LocalUserMasks) : [];
  CopyMasks.value = [...result, ...CopyMasks.value];
  UserAddMasks.value = result; // 读取本地的值，没有就算了
});
// 根据时间戳删除 mask 自带的不删除
const DeleteUserMask = (number) => {
  // 用户添加的 根据时间戳删除
  UserAddMasks.value = UserAddMasks.value.filter((item) => {
    if (item[2]) {
      return item[2] !== number;
    }
  });
  // 删除CopyMasks的值   展示在页面的数据
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
let SearchInput = ref('');
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
    role: 'system',
    content: maskStr,
  });
  // 路由的跳转
  $Router.push(`/chat/${G_UUID}`);
};

// 控制 添加新的预设角色 的对话框
let DialogVisible = ref(false);
// 控制 添加新的预设角色 的对话框 是否显示
let ControlDialogVisible = () => {
  DialogVisible.value = true;
};
// 对话框的宽
let DialogWidth = computed(() => {
  if (ParametsSetting.w_phone) {
    return '85%';
  } else {
    return '50%';
  }
});
// 添加新角色的标题
let DialogTitle = ref('');
// 添加新角色的描述
let DialogContent = ref('');
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
    DialogTitle.value = '';
    DialogContent.value = '';
  } else {
    ElMessage({
      message: '标题 和 预设角色的描述 必须填写',
      type: 'warning',
    });
  }
};

// 组件销毁
onBeforeUnmount(() => {
  // 停止对UserAddMasks数据的监视
  stopWatchUserAddMasks();
});
</script>

<template>
  <!--  bg-violet-100 -->
  <div class="h-full w-full">
    <!-- 工具栏 -->
    <div class="flex items-center justify-between gap-3 px-1 pb-4">
      <!-- 返回 -->
      <CustomizeButton iconName="left" content="返回" :clickHandler="GobackOne" />
      <!-- 搜索 -->
      <input
        v-model.trim="SearchInput"
        v-focus
        class="h-11 w-[70%] appearance-none rounded-xl border bg-[color:var(--base-bgc)] px-3 py-2 text-center leading-tight text-[color:var(--setting-color)] shadow focus:outline-1 maxd:h-8"
        type="text"
        placeholder="搜索预设角色" />
      <!-- 新建 -->
      <CustomizeButton iconName="add" content="新建" :clickHandler="ControlDialogVisible" />
    </div>
    <!-- 主体  -->
    <el-scrollbar ref="El_Scrollbar" :max-height="ParametsSetting.BottomHeight * 0.85">
      <div
        v-for="item in ProxyMasks"
        :key="item[0]"
        class="relative mb-3 cursor-pointer rounded-xl border-2 text-[color:var(--setting-color)] shadow-md transition-all hover:bg-violet-300 hover:text-black active:scale-95">
        <div class="flex flex-col p-3" @click="ChoiceMaskChat(item[1])">
          <!-- title -->
          <span class="w-60 whitespace-nowrap text-2xl font-normal">
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
          class="absolute right-0 top-1/2 mr-5 h-11 w-16 -translate-y-1/2 rounded-md bg-rose-500 transition-all hover:bg-rose-600 active:scale-90">
          删除
        </button>
      </div>
    </el-scrollbar>
    <!-- 添加新的预设角色 的 dialog -->
    <el-dialog v-model="DialogVisible" :width="DialogWidth" align-center>
      <template #header>
        <span class="text-[color:var(--setting-color)]">添加新的预设角色</span>
      </template>
      <div class="flex flex-col gap-3">
        <el-input type="textarea" v-model="DialogTitle" autosize resize="none" placeholder="标题" />
        <el-input
          type="textarea"
          v-model="DialogContent"
          :autosize="{ minRows: 4, maxRows: 6 }"
          resize="none"
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
