/**
 * 注册全局组件
 * 组件名称必须以 大驼峰命名法 定义
 * 所有组件都放在 components 文件夹下
 * 组件文件名必须以 .vue 结尾
 * 注意：有些组件要提前引入 相关插件 才能正常工作 具体要看对应的官方文档
 */

// 引入 svg 相关插件
import 'virtual:svg-icons-register'; // 插件

/**
 * 注册全局组件 app 为 Vue 实例
 * 在 main.js 中调用时传入 app 实例
 */
export function registerGlobalComponents(app) {
  if (!app) throw new Error('app 实例未传入');
  try {
    // 动态导入 components 文件夹下的所有 .vue 文件，包括子文件夹
    const components = import.meta.glob('@/components/**/*.vue');
    // 遍历所有导入的组件，并注册为全局组件
    Object.entries(components).forEach(([path, component]) => {
      if (component) {
        // 确保组件存在
        // 自动生成组件名称，如：MyComponent.vue -> MyComponent

        const com_Name = path
          .split('/')
          .pop()
          .replace(/\.vue$/, ''); // 直接去除 .vue 后缀
        // console.log(`注册全局组件: ${componentName}`);
        // 注册全局组件
        app.component(com_Name, component);
      } else {
        console.warn(`组件未能加载: ${path}`); // 组件加载失败时的警告
      }
    });
  } catch (error) {
    console.error('注册全局组件时发生错误:', error);
  }
}
