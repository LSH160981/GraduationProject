<h1 align="center">ChatGPTDemo (ChatGPT Vue Web)</h1>

![cover](./docs/images/cover.png)

# GPT-Web-Url

- main - [https://1.sudofly.xyz](https://1.sudofly.xyz)
- main_vercel - [https://1.sudofly.com](https://1.sudofly.com)
- xiaoliao - [https://xiaoliao.sudofly.xyz](https://xiaoliao.sudofly.xyz)

# GPT

本项目使用 Vue3+Vite 完成 [反馈](https://github.com/LSH160981/GraduationProject/issues)

## 项目亮点

- 优化打包结果
  - 按需加载组件`UI`;
  - 打包结果分包`rollupOptions`;
  - 使用`terser`移除测试代码 例如:`console.log`等等;
- `Pinia`+组合式 `API` 实现仓库数据存储;
- `VueRouter` 流畅的使用单页应用(前置守卫);
- 使用 `TailwindCSS` 完成网站整体的样式(多端适配，主题切换);
- 使用 `fetch` 实现流式读取网络数据;
- 每隔 10 秒自动轮询检测网页是否更新;
- 封装 `SVG` 组件 <use>标签可以减少 HTTP 请求;
- 针对 `setInterval` 运行的动画函数换成 `requestAnimationFrame` 运行
- 优化性能：在`onBeforeUnmount`停止一切监听
- 使用`terser`处理打包后的结果
- 针对`IOS`用户切换浏览器主题时状态栏的变化

## 主要功能

- 在 1 分钟内使用 Vercel **免费一键部署**
- 提供体积极小（~5MB）的跨平台客户端（Linux/Windows/MacOS）
- 完整的 Markdown 支持：LaTex 公式、Mermaid 流程图、代码高亮等等
- 精心设计的 UI，响应式设计，支持深色模式
- 极快的首屏加载速度（~100kb），支持流式响应
- 隐私安全，所有数据保存在用户浏览器本地
- 预制角色功能（面具），方便地创建、分享和调试你的个性化对话
- 海量的内置 prompt 列表来自 [中文](https://github.com/PlexPt/awesome-chatgpt-prompts-zh)
- 自动压缩上下文聊天记录，在节省 Token 的同时支持超长对话
- 在任何地方**无障碍**快速访问

## GPT 接口 · KEY

<div align="left">

[接口项目](https://github.com/chatanywhere/GPT_API_free) --- [KEY 的获取](https://api.chatanywhere.org/v1/oauth/free/github/render)

</div>

## 项目初始化

```sh
pnpm install
```

### 项目在本地运行

```sh
pnpm dev
```

### 项目打包

```sh
pnpm build
```

## 项目环境

- Node.js[(.nvmrc)](./.nvmrc) === v20.11.0
- pnpm[(pnpm-lock.yaml)](./pnpm-lock.yaml) === v9.0

## LICENSE

[MIT](https://opensource.org/license/mit/)
