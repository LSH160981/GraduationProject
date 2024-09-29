/**
 * development ：这是在开发环境中常见的值，此时项目处于开发阶段。
 * production ：这是在生产环境中常见的值，此时项目已经部署并对外提供服务。
 * 在开发环境中 就不要检测
 */
if (process.env.NODE_ENV === 'production') {
  // 代码每 隔一段时间 检查 文件是否有更新; 引入就可以,里面会执行
  import('@/utils/UpdatedChecker.js')
}

import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

import { version } from '../package.json' // 引入package.json中的版本号
window.$AppVersion = version  // 全局变量 $AppVersion 存储版本号

import './assets/css/main.css' // tailwindcss

import { registerGlobalComponents } from '@/components' // 注册全局组件
registerGlobalComponents(app)

import { createPinia } from 'pinia' // pinia仓库
app.use(createPinia())

import router from './router' // 路由
app.use(router)

import GlobalDirective from '@/utils/MyDirective' // 自定义的全局 指令
app.use(GlobalDirective)

import VMdPreview from '@/plugins/VMd.js' // markdown 插件
app.use(VMdPreview)

app.mount('#app')
