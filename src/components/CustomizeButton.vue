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
    class="box-content w-[52px] h-12 px-4 bg-gray-100 rounded-lg text-sm font-bold transition-all maxd:h-7 hover:bg-gray-300 active:scale-95"
    @click="clickHandler">
    <div class="flex justify-center items-center cursor-pointer truncate">
      <div>
        <SVG :name="iconName"></SVG>
      </div>
      <span class="text-[color:var(--base-textColor)]">{{ content }}</span>
    </div>
  </button>
</template>

<style scoped></style>
