<script setup>
/**
 * 安装：
 *    1.pnpm i vite-plugin-svg-icons -D
 *    2.main.js 的引入 import 'virtual:svg-icons-register'
 *    3.vite.config.js 的配置
 *      import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
 *      import path from 'path';
 *       // svg 的插件配置
 *        createSvgIconsPlugin({
 *          iconDirs: [path.resolve(process.cwd(), 'src/assets/SVG')], // 路径根据实际情况来
 *          symbolId: 'icon-[dir]-[name]',
 *        }),
 *    4.在mian.js中全局注册
 * 使用方法：
 *     对应的目录下必须先有文件.svg
 *     <SVG name="XXX"></SVG>
 *     其中 XXX 对应的是  目录('src/assets/SVG')下的文件名字 区分大小写
 */

// 父组件传来的参数
defineProps({
  name: {
    type: String,
    required: true,
  },
  width: {
    type: String,
    default: '24px',
  },
  height: {
    type: String,
    default: '24px',
  },
  // 固定颜色  fill不会随主题变化而变化
  FixedColor: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <!-- {{ FixedColor }} -->
  <!-- svg 图标的外层容器，内部与use配合使用 -->
  <!-- fill 是标签属性之一表示填充的颜色 
        使用三目运算符 确认是否固定用某一种颜色
  -->
  <svg
    :style="{
      width,
      height,
      fill: FixedColor ? FixedColor : `var(--svg-color)`,
    }">
    <!-- xlink: href 指定用哪一个图标 必须是以  # icon-xxx -->
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<style scoped></style>
