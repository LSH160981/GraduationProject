<script setup>
/**
 * 父组件传递的 数据
 */
defineProps({
  iconName: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
  clickHandler: {
    type: Function,
    require: true,
  },
});
</script>

<template>
  <!-- 返回  bg-[color:var(--setting-color)]-->
  <button
    class="box-content h-12 w-[52px] rounded-lg bg-gray-100 px-4 text-sm font-bold transition-all hover:bg-gray-300 active:scale-95 maxd:h-7"
    @click="clickHandler">
    <div class="flex cursor-pointer items-center justify-center truncate">
      <div>
        <SVG :name="iconName"></SVG>
      </div>
      <span class="text-[color:var(--base-textColor)]">{{ content }}</span>
    </div>
  </button>
</template>

<style scoped></style>
