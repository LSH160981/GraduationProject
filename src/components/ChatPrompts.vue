<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import { AddZeroWidthChars, RemoveZeroWidthChars } from '@/utils/ZeroWidthChars';
import prompts from '@/assets/JSON/prompts';
let CopyPrompts = computed(() => {
  let result = [];
  // 给每一个描述都加上 零宽字符
  prompts.forEach((i) => {
    let s = [i[0], AddZeroWidthChars(i[1])];
    result.push(s);
  });
  return result;
});

// 选择的索引
let SelectIndex = ref(1);

// ChatPromptsContainer  元素
let ChatPromptsContainer;

// 父组件的数据
let $defineProps = defineProps({
  // 父组件传过来的函数
  SurePrompt: {
    type: Function,
    require: true,
  },
  InputValue: {
    type: String,
    require: true,
  },
});

// ProxyPrompts 等于 原始数据 + InputValue
let ProxyPrompts = computed(() => {
  let results = [];
  // 去除 '/'
  let keyword = $defineProps.InputValue.slice(1);
  CopyPrompts.value.forEach((item) => {
    if (item[0].includes(keyword) || item[1].includes(keyword)) {
      results.push(item);
    }
  });
  return results;
});

// 对父组件传来的数据进行监视
let stopWatchDefinePropsInputValue = watch(
  () => $defineProps.InputValue,
  () => {
    // 当找不到数据 时就算了
    if (ProxyPrompts.value.length <= 0) {
      return;
    }
    let el = SelectChildElement(1);
    SiblingsClearCSS(el);
  }
);

// 确认 关键的 Prompt
const SetPrompt = (prompt) => {
  $defineProps.SurePrompt(RemoveZeroWidthChars(prompt));
};

// 子元素 鼠标进入事件回调
const mouseenterHandler = ($even) => {
  SiblingsClearCSS($even.target);
  SelectIndex.value = +$even.target.getAttribute('index');
};

// 所有兄弟元素 清除 border 样式  自己添加固定样式
const SiblingsClearCSS = (elem) => {
  // 获取父元素
  const parent = elem.parentNode;
  // 遍历父元素下的所有子元素
  Array.from(parent.children).forEach((child) => {
    child.style.borderColor = 'var(--base-bgc)';
  });
  // 目标元素 添加样式
  elem.style.borderColor = '#22c55e';
};

// ChatPromptsMain 的 子元素 返回这个元素
const SelectChildElement = (index) => {
  // 判断 index 是否 合法
  if (index < 1) {
    SelectIndex.value = index = 1;
  }
  if (index >= ProxyPrompts.value.length) {
    SelectIndex.value = index = ProxyPrompts.value.length;
  }

  // 选择 对应的子元素
  if (index === 1) {
    return document.querySelector('.ChatPromptsMain > :first-child');
  } else {
    return document.querySelector(`.ChatPromptsMain > :nth-child(${index})`);
  }
};

// 键盘按下事件
const keydown_handler = (even) => {
  if (even.key === 'ArrowUp') {
    even.preventDefault();
    SelectIndex.value--;
    if (SelectIndex.value > 1) {
      // typeof number
      ChatPromptsContainer.scrollTop -= 50;
    }
    let el = SelectChildElement(SelectIndex.value);
    SiblingsClearCSS(el);
  } else if (even.key === 'ArrowDown') {
    even.preventDefault();
    SelectIndex.value++;
    if (SelectIndex.value > 5) {
      // typeof number
      ChatPromptsContainer.scrollTop += 55;
    }
    let el = SelectChildElement(SelectIndex.value);
    SiblingsClearCSS(el);
  } else if (even.key === 'Enter') {
    even.preventDefault();
    $defineProps.SurePrompt(SelectChildElement(SelectIndex.value).children[1].textContent);
  }
};

nextTick(() => {
  ChatPromptsContainer = document.querySelector('.ChatPromptsContainer');
  document.addEventListener('keydown', keydown_handler);
  let F_el = SelectChildElement(SelectIndex.value);
  F_el.style.borderColor = '#22c55e';
});

// 组件销毁
onBeforeUnmount(() => {
  // 移除键盘事件的监视
  document.removeEventListener('keydown', keydown_handler);
  // 停止对 父组件数据 的监视
  stopWatchDefinePropsInputValue();
});
</script>

<template>
  <!-- ChatPrompts   -->
  <div class="ChatPromptsContainer">
    <!-- 主体  -->
    <div class="ChatPromptsMain">
      <!-- hover:border-green-500 first-of-type:border-green-500 -->
      <div
        v-for="(item, index) in ProxyPrompts"
        :key="index"
        :index="index + 1"
        @click="SetPrompt(item[1])"
        @mouseenter="mouseenterHandler"
        class="EverPart">
        <!-- title -->
        <div class="whitespace-nowrap text-sm font-bold">{{ item[0] }}</div>
        <!-- 主题的内容 -->
        <div class="truncate text-sm">{{ item[1] }}</div>
      </div>
    </div>
    <div v-if="ProxyPrompts.length === 0" class="text-center text-red-400">抱歉! 没有找到您想要的~~</div>
  </div>
</template>

<style scoped>
/* 容器 */
.ChatPromptsContainer {
  /* scrollbar-hidden 自定义TW属性 隐藏滚动条 具体看tailwind.config.js的plugins */
  @apply scrollbar-hidden absolute bottom-full z-[3] mb-2 max-h-[500px] w-full overflow-scroll overflow-x-hidden rounded-lg border bg-[color:var(--base-bgc)] p-2 shadow-[inset_2px_20px_30px_-10px_rgba(0,0,0,0.3)] shadow-slate-400;
}
/* 每一个 部分 */
.EverPart {
  @apply mb-1 cursor-pointer rounded-lg border border-[color:var(--base-bgc)] p-1 text-[color:var(--setting-color)] transition-all duration-500;
}
</style>
