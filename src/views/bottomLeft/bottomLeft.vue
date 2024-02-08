<script setup>
import { ref, watch, nextTick } from "vue";
import SliderItem from "./sliderItem.vue";
import MaskPlay from "@/components/MaskPlay.vue";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();
import { useGlobalInformationStore } from "@/stores/GlobalInformation.js";
let GlobalInformation = useGlobalInformationStore();
import { useCurrentChatInfoStore } from "@/stores/currentChatInfo.js";
let { ChangeUUID } = useCurrentChatInfoStore();

// 这个组件的根元素
let BottomLeft = ref(null);
// 控制BottomLeft组件的高度
watch(
  () => ParametsSetting.BottomHeight,
  (newValue) => {
    nextTick(() => {
      BottomLeft.value.style.height = `${newValue}px`;
    });
  },
  {
    immediate: true,
  }
);

// 通过UUID更改 某一个对话的title
const ChangeTitle = (uuid, title) => {
  GlobalInformation.ChangeChatTitleByUUID(uuid, title);
};

// 根据UUID  删除 某一个对话
const DeleteMsg = (uuid) => {
  GlobalInformation.DeleteChatByUUID(uuid);
};

// 新建对话就是 让CurrentChatInfo-->uuid置空
const NewChat = () => {
  // 获取所有带有 'uuid' 属性的元素
  let elements = document.querySelectorAll("[uuid]");
  elements.forEach((element) => {
    element.classList.remove("bg-gray-300");
  });
  ChangeUUID("");
  // 如果 w_phone为真的话 还要把 el-drawer 关掉
  if (ParametsSetting.w_phone) {
    ParametsSetting.SliderBarDrawerFlag = false;
  }
};
</script>

<template>
  <!-- bg-violet-100 -->
  <div ref="BottomLeft" class="p-3 border-r rounded-bl bg-[#e7f8ff]">
    <!-- max-height="20px" -->
    <el-scrollbar>
      <div class="flex justify-evenly items-center gap-2 border-b-2 pb-2 mb-2">
        <!-- 面具 -->
        <MaskPlay @NewChat="NewChat"></MaskPlay>
        <!-- 新建对话 -->
        <div @click="NewChat" class="SliderItemTop">
          <div>
            <svg
              t="1707044047323"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4221"
              width="24"
              height="24">
              <path
                d="M853.333333 501.333333c-17.066667 0-32 14.933333-32 32v320c0 6.4-4.266667 10.666667-10.666666 10.666667H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V213.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h320c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H170.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666666v640c0 40.533333 34.133333 74.666667 74.666667 74.666667h640c40.533333 0 74.666667-34.133333 74.666666-74.666667V533.333333c0-17.066667-14.933333-32-32-32z"
                fill="#53b1e2"
                p-id="4222"></path>
              <path
                d="M405.333333 484.266667l-32 125.866666c-2.133333 10.666667 0 23.466667 8.533334 29.866667 6.4 6.4 14.933333 8.533333 23.466666 8.533333h8.533334l125.866666-32c6.4-2.133333 10.666667-4.266667 14.933334-8.533333l300.8-300.8c38.4-38.4 38.4-102.4 0-140.8-38.4-38.4-102.4-38.4-140.8 0L413.866667 469.333333c-4.266667 4.266667-6.4 8.533333-8.533334 14.933334z m59.733334 23.466666L761.6 213.333333c12.8-12.8 36.266667-12.8 49.066667 0 12.8 12.8 12.8 36.266667 0 49.066667L516.266667 558.933333l-66.133334 17.066667 14.933334-68.266667z"
                fill="#53b1e2"
                p-id="4223"></path>
            </svg>
          </div>
          <span>新对话</span>
        </div>
      </div>

      <div v-for="item in GlobalInformation.AllChatInfo" :key="item.uuid">
        <SliderItem :ChatInfo="item" @DeleteMsg="DeleteMsg" @ChangeTitle="ChangeTitle" />
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped></style>
