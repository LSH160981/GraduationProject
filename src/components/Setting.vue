<script setup>
import { ClearAll } from "@/utils/HandlerToken.js";
import RangeInput from "./RangeInput.vue";
import CustomizeButton from "./CustomizeButton.vue";
import { ElMessage } from "element-plus";
import { useParametsSettingStore } from "@/stores/ParametsSetting.js";
let ParametsSetting = useParametsSettingStore();
import { useSettingStore } from "@/stores/Setting.js";
let Setting = useSettingStore();
import { useRouter } from "vue-router";
let $Router = useRouter();

// 返回上一级
const GobackOne = () => {
  $Router.back();
};

// 主题切换 val是[el-switch组件]返回的值[val: boolean]
const ChooseTheme = (val) => {
  Setting.Theme = val;
};

// 模型 选择的回调
const ChooseModel = (m) => {
  if (m === "gpt-4") {
    ElMessage({
      message: `GPT-4,每天只能用3次。每天00:00更新, 想要更多次请联系-小廖`,
      type: "warning",
      duration: 3500,
    });
  }
  Setting.GPT_Setting.Model = m;
};
// 改变 随机值的函数
let ChangeTemperature = (e) => {
  Setting.GPT_Setting.Temperature = +e.target.value;
};
// 改变 核采样的函数
let ChangeTop_p = (e) => {
  Setting.GPT_Setting.Top_p = +e.target.value;
};
// 改变 单次交互所用的最大 Token 数
let ChangeMax_tokens = (e) => {
  Setting.GPT_Setting.Max_tokens = +e.target.value;
};
//  改变 Presence_penalty
let ChangePresence_penalty = (e) => {
  Setting.GPT_Setting.Presence_penalty = +e.target.value;
};
// 改变 Frequency_penalty
let ChangeFrequency_penalty = (e) => {
  Setting.GPT_Setting.Frequency_penalty = +e.target.value;
};
// 改变 历史消息长度压缩阈值
let ChangeHistoryCompression = (e) => {
  Setting.GPT_Setting.HistoryCompression = +e.target.value;
};
// 改变 为每个输入消息生成多少个聊天完成选项。
let ChangeN = (e) => {
  ElMessage({
    message: `如果没有特殊要求请不要改动这个配置`,
    type: "warning",
    duration: 3000,
    grouping: true,
  });
  Setting.GPT_Setting.N = +e.target.value;
};
// 改变 附带历史消息数。(GPT发送时 携带多少组信息)
let ChangeCarriedHistoryMessages = (e) => {
  Setting.GPT_Setting.CarriedHistoryMessages = +e.target.value;
};

// 退出登录
const Logout = () => {
  console.log("退出登录");
  ClearAll();
  window.location.href = "/";
  window.location.reload();
};
</script>

<template>
  <!-- bg-rose-50 -->
  <div class="w-full h-full select-none">
    <!-- top -->
    <div
      class="flex justify-between items-center gap-1 px-1 pb-3 text-[color:var(--setting-color)]">
      <!-- // 返回上一级 -->
      <CustomizeButton iconName="left" content="返回" :clickHandler="GobackOne" />
      <span class="text-2xl">参数设置</span>
    </div>
    <!-- 主体  -->
    <el-scrollbar :max-height="ParametsSetting.BottomHeight * 0.89">
      <!-- 第一部分 -->
      <div class="EverPart">
        <!-- 主题颜色 -->
        <div class="px-5 py-3 flex justify-between items-center">
          <span class="text-base font-bold">主题颜色</span>
          <div class="flex justify-between items-center gap-2">
            <span>
              <SVG name="sun"></SVG>
            </span>
            <el-switch v-model="Setting.Theme" @change="ChooseTheme">
              <template #active-action>
                <span class=" ">D</span>
              </template>
              <template #inactive-action>
                <span class=" ">L</span>
              </template>
            </el-switch>
            <span>
              <SVG name="moon"></SVG>
            </span>
          </div>
        </div>
      </div>
      <!-- 第二部分 -->
      <div class="EverPart">
        <!-- 第一项 模型 -->
        <div class="SecondItem">
          <span class="text-base font-bold">模型 (model)</span>
          <el-dropdown trigger="click" class="h-9" @command="ChooseModel">
            <span
              class="min-w-36 flex justify-evenly items-center rounded-xl border p-3 text-[color:var(--setting-color)] transition-all active:scale-95">
              {{ Setting.GPT_Setting.Model }}
              <SVG name="bottom"></SVG>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="gpt-3.5-turbo"> gpt-3.5-turbo </el-dropdown-item>
                <el-dropdown-item command="gpt-4"> gpt-4 </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <!-- 第二项 随机性 -->
        <div class="SecondItem">
          <div>
            <div class="text-base font-bold">随机性 (temperature)</div>
            <div class="text-xs">值越大，回复越随机</div>
          </div>
          <RangeInput
            :value="Setting.GPT_Setting.Temperature"
            :min="0"
            :max="2"
            :step="0.1"
            @input="ChangeTemperature" />
        </div>
        <!-- 第三项 核采样 -->
        <div class="SecondItem">
          <div>
            <div class="text-base font-bold">核采样 (top_p)</div>
            <div class="text-xs">与随机性类似，但不要和随机性一起更改</div>
          </div>
          <RangeInput
            :value="Setting.GPT_Setting.Top_p"
            :min="0"
            :max="1"
            :step="0.1"
            @input="ChangeTop_p" />
        </div>
        <!-- 第四项 单次交互所用的最大 Token 数 -->
        <div class="SecondItem">
          <div>
            <div class="text-base font-bold">单次回复限制 (max_tokens)</div>
            <div class="text-xs">单次交互所用的最大 Token 数</div>
          </div>
          <input
            :value="Setting.GPT_Setting.Max_tokens"
            class="myInput"
            type="number"
            @input="ChangeMax_tokens" />
        </div>
        <!-- 第五项 话题新鲜度 (presence_penalty) -->
        <div class="SecondItem">
          <div>
            <div class="text-base font-bold">话题新鲜度 (presence_penalty)</div>
            <div class="text-xs">值越大，越有可能扩展到新话题</div>
          </div>
          <RangeInput
            :value="Setting.GPT_Setting.Presence_penalty"
            :min="-2"
            :max="2"
            :step="0.1"
            @input="ChangePresence_penalty" />
        </div>
        <!-- 第六项 频率惩罚度 (frequency_penalty) -->
        <div class="SecondItem">
          <div>
            <div class="text-base font-bold">频率惩罚度 (frequency_penalty)</div>
            <div class="text-xs">值越大，越有可能降低重复字词</div>
          </div>
          <RangeInput
            :value="Setting.GPT_Setting.Frequency_penalty"
            :min="-2"
            :max="2"
            :step="0.1"
            @input="ChangeFrequency_penalty" />
        </div>
        <!-- 第七项 历史消息长度压缩阈值 -->
        <div class="SecondItem">
          <div>
            <div class="text-base font-bold">历史消息长度压缩阈值</div>
            <div class="text-xs">当未压缩的历史消息超过该值时，将进行压缩</div>
          </div>
          <input
            :value="Setting.GPT_Setting.HistoryCompression"
            class="myInput"
            type="number"
            @input="ChangeHistoryCompression" />
        </div>
        <!-- 第八项 为每个输入消息生成多少个聊天完成选项。 -->
        <div class="SecondItem">
          <div>
            <div class="text-base font-bold">返回的聊天个数 (n)</div>
            <div class="text-xs">为每个输入消息生成多少个聊天完成选项。</div>
          </div>
          <RangeInput :value="Setting.GPT_Setting.N" :min="1" :max="2" :step="1" @input="ChangeN" />
        </div>
        <!-- 第九项 附带历史消息数。 -->
        <div class="SecondItem">
          <div>
            <div class="text-base font-bold">附带历史消息数</div>
            <div class="text-xs">每次请求携带的历史消息数</div>
          </div>
          <RangeInput
            :value="Setting.GPT_Setting.CarriedHistoryMessages"
            :min="1"
            :max="100"
            :step="1"
            @input="ChangeCarriedHistoryMessages" />
        </div>
      </div>
      <!-- 第三部分 -->
      <div class="EverPart">
        <div class="px-5 py-3 flex justify-between items-center">
          <span class="text-base font-bold">清除本地信息并退出登录</span>
          <button
            @click="Logout"
            class="rounded-md p-3 flex justify-evenly gap-2 bg-rose-500 transition-all hover:bg-rose-600 active:scale-90">
            <span>
              <SVG name="logout"></SVG>
            </span>
            <div class="truncate">退出登录</div>
          </button>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
/**
  在 TW 中 first-of-type 用以设置当该元素是同类型的标签中，作为其父元素的第一个子元素的状态下的样式。
  另一个先对的状态变量是 last-of-type
 */
/* 每一个 部分 */
.EverPart {
  color: var(--setting-color);
  @apply w-full border rounded-xl mt-4 first-of-type:mt-0;
}
/* 第一部分 里面的每一个子项目 */
.SecondItem {
  @apply px-5 py-3 flex justify-between items-center border-b last-of-type:border-b-0;
}

/* 自定义的 number input 的样式 */
.myInput {
  transition: all 0.5s;
  width: 120px;
  max-width: 40%;
  user-select: none;
  text-align: center;
  appearance: none;
  border-radius: 10px;
  border: 1px solid #dedede;
  min-height: 36px;
  box-sizing: border-box;
  padding: 0 10px;
  font-family: inherit;
  background-color: var(--base-bgc);
  color: var(--setting-color);
}
</style>
