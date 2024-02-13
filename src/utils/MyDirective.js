/**
 * 这个文件是我自己定义的一个插件
 * 作用: 注册自定义指令
 */

import { nextTick } from 'vue'

export default {
    // 当使用插件时,会给install方法自动注入app,这个app就是入口函数的大哥大由createApp返回的!
    // 注册全局指令
    install(app) {
        // 自动聚焦input
        app.directive('focus', {
            // 当绑定元素挂载到 DOM 中时...
            mounted: (el) => {
                // 如果该元素本身就是 input 直接聚焦
                if (el.nodeName === 'INPUT') {
                    el.focus();
                    el.select()
                    return
                }
                // 如果是 el-input 组件 通过querySelector选中子元素中的 input 再去聚焦
                let input = el.querySelector("input");
                nextTick(() => {
                    setTimeout(() => {
                        input.focus(); // 原生聚焦
                        input.select(); // 原生全选
                    }, 30);
                });
            }
        })
    }
}
