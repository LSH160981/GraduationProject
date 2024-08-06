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

// 引入svg相关插件 与 组件
import 'virtual:svg-icons-register' // 插件
import SVG from '@/components/SVG.vue'// 组件

//  Markdown   预览组件以及样式 --start
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// VuePress主题以及样式（这里也可以选择github主题）
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// 快速复制代码
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// markdown支持显示代码行数
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
// 数学函数 解析
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/npm';
// Prism
import Prism from 'prismjs';
// 代码高亮
import 'prismjs/components/prism-json';
// 选择使用主题
VMdPreview.use(vuepressTheme, {
    Prism,
});
// 鼠标放置在代码区域，会出现复制按钮：
VMdPreview.use(createCopyCodePlugin());
// markdown支持显示代码行数
VMdPreview.use(createLineNumbertPlugin());
// 数学函数 解析
VMdPreview.use(createKatexPlugin());
//  Markdown --end

app.use(createPinia()); // pinia插件
app.use(router); // 路由
app.use(GlobalDirective); // 自定义指令
app.component('SVG', SVG); // 全局组件 SVG
app.use(VMdPreview); // Markdown 插件
app.mount('#app')
