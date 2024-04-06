import { fileURLToPath, URL } from 'node:url'
// svg 的插件引入
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // svg 的插件配置
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/SVG')],
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    minify: 'terser', // 确保使用terser进行压缩
    terserOptions: {
      compress: {
        // drop_console: true, // 删除所有console语句
        pure_funcs: ['console.log'] // 如果你只想删除console.log
      }
    }
  }
})
