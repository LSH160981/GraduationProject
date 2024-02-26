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
    terserOptions: {
      compress: {
        pure_funcs: ['console.log'] // 删除所有的console.log [只删除log]
      }
    }
  }
})
