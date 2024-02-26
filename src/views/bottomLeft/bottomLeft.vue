<script setup>
import { ref, watch, nextTick, onMounted } from "vue";
import SliderItem from "./sliderItem.vue";
import { RouterLink } from "vue-router";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();
import { useGlobalInformationStore } from "@/stores/GlobalInformation.js";
let GlobalInformation = useGlobalInformationStore();
import { useCurrentChatInfoStore } from "@/stores/CurrentChatInfo.js";
let { ChangeUUID, SliderItemChangeBorder } = useCurrentChatInfoStore();

// 这个组件的根元素
let BottomLeft = ref(null);
// 控制BottomLeft组件的高度
watch(
  () => ParametsSetting.BottomHeight,
  (newValue) => {
    nextTick(() => {
      if (ParametsSetting.w_phone) {
        BottomLeft.value.style.height = `100vh`;
      } else {
        BottomLeft.value.style.height = `${newValue}px`;
      }
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

// 点击面具和新建对话的回调
const IsCloseDrawer = () => {
  // 默认新建对话
  ChangeUUID("");
  // 如果 w_phone为真的话 还要把 el-drawer 关掉
  if (ParametsSetting.w_phone) {
    ParametsSetting.SliderBarDrawerFlag = false;
  }
};

// 通过TWCSS改变 border
onMounted(() => {
  SliderItemChangeBorder();
});
</script>

<template>
  <!-- BottomLeft -->
  <div ref="BottomLeft" class="BottomLeft">
    <!-- max-height="20px" -->
    <el-scrollbar>
      <div class="flex justify-evenly items-center gap-2 border-b-2 pb-2 mb-2">
        <!-- 面具 -->
        <RouterLink
          to="/maskplay"
          active-class="maskplayActive"
          @click="IsCloseDrawer"
          class="SliderItemTop">
          <div>
            <SVG name="mask"></SVG>
          </div>
          <span>面具</span>
        </RouterLink>
        <!-- 新建对话  -->
        <RouterLink to="/chat" @click="IsCloseDrawer" class="SliderItemTop">
          <div>
            <SVG name="edit"></SVG>
          </div>
          <span>新对话</span>
        </RouterLink>
      </div>

      <div v-for="item in GlobalInformation.AllChatInfo" :key="item.uuid">
        <RouterLink :to="{ path: `/chat/${item.uuid}` }">
          <SliderItem :ChatInfo="item" @DeleteMsg="DeleteMsg" @ChangeTitle="ChangeTitle" />
        </RouterLink>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.BottomLeft {
  @apply p-3 border-r rounded-bl  bg-[color:var(--container-bgc)];
  /* @apply dark:[]; */
}

/* Vue3 RouterLink 被激活的样式 */
.maskplayActive {
  background-color: #e49fff;
}
/* TW 的 复合样式 */
.SliderItemTop {
  @apply w-[47%] bg-white shadow-md truncate
  flex justify-evenly items-center
  p-3 rounded-lg cursor-pointer
  hover:bg-violet-300 transition-all active:scale-95
  text-[color:var(--base-textColor)];
}
</style>
