import { reactive, watch, toRaw } from 'vue'
import { defineStore } from 'pinia'

export const useGPTSettingStore = defineStore('GPTSetting', () => {
    let GPT_Setting = reactive({
        // 记录选择的模型
        Model: "gpt-3.5-turbo",
        // 随机性 值越大，回复越随机
        Temperature: 0.5,
    })
    // 查询本地有没有保存过用户 使用GPT的习性
    let result;
    if (result = JSON.parse(localStorage.getItem('GPT_Setting'))) {
        // reactive 重新分配一个新对象，会`失去`响应式（可以使用`Object.assign`去整体替换）
        GPT_Setting = Object.assign(GPT_Setting, result);
    }

    watch(
        () => GPT_Setting,
        (newSetting) => {
            let result = JSON.stringify(toRaw(newSetting))
            localStorage.setItem('GPT_Setting', result);
        },
        {
            deep: true,
            immediate: true
        }
    )

    return {
        GPT_Setting
    }
})
