/**
   * development ：这是在开发环境中常见的值，此时项目处于开发阶段。
   * production ：这是在生产环境中常见的值，此时项目已经部署并对外提供服务。
   * 在开发环境中 就不要检测
  */
if (process.env.NODE_ENV === "production") {
    // 代码每 隔一段时间 检查 文件是否有更新; 引入就可以,里面会执行
    import('@/utils/UpdatedChecker.js')
}

// tailwindcss
import './assets/css/main.css';

import { createApp } from 'vue';
import App from './App.vue';
const app = createApp(App);

import { createPinia } from 'pinia'; // 仓库
import router from './router'; // 路由
import GlobalDirective from "@/utils/MyDirective"; // 自定义的全局 指令

import { registerGlobalComponents } from '@/components';
// 注册全局组件
registerGlobalComponents(app);

// markdown 
import VMdPreview from '@/plugins/VMd.js'

app.use(createPinia()); // pinia插件
app.use(router); // 路由
app.use(GlobalDirective); // 自定义指令 
app.use(VMdPreview); // Markdown 插件
app.mount('#app')
