import { ref, reactive, watch, toRaw } from 'vue'
import { defineStore } from 'pinia'
import DayOrNight from '@/utils/DayOrNight.js'

/**
 * 这个仓库对应的是 Setting.vue 这个组件
 */
export const useSettingStore = defineStore('Setting', () => {
    // GPT 设置 的默认值
    let GPT_Setting = reactive({
        // 记录选择的模型
        Model: "GPT-3.5-Turbo",
        // 随机性 值越大，回复越随机
        Temperature: 0.5,
        // 一种替代温度采样的方法，称为核采样，其中模型考虑具有 top_p 概率质量的标记的结果。
        // 所以 0.1 意味着只考虑构成前 10% 概率质量的标记。 我们通常建议改变这个或temperature但不是两者。
        Top_p: 0.5,
        // 聊天完成时生成的最大令牌数。 输入标记和生成标记的总长度受模型上下文长度的限制。
        Max_tokens: 5000,
        // -2.0 和 2.0 之间的数字。正值会根据到目前为止是否出现在文本中来惩罚新标记，从而增加模型谈论新主题的可能性。
        Presence_penalty: 0.5,
        // -2.0 和 2.0 之间的数字。正值会根据新标记在文本中的现有频率对其进行惩罚，从而降低模型逐字重复同一行的可能性。
        Frequency_penalty: 0.5,
        // 历史消息长度压缩阈值
        HistoryCompression: 1000,
        // 为每个输入消息生成多少个聊天完成选项。
        N: 1,
        // 每次请求携带的历史消息数
        CarriedHistoryMessages: 10
    })
    // 查询本地有没有保存过用户 使用GPT的习惯
    let GPT_SettingResult;
    if (GPT_SettingResult = JSON.parse(localStorage.getItem('GPT_Setting'))) {
        // reactive 重新分配一个新对象，会`失去`响应式（可以使用`Object.assign`去整体替换）
        GPT_Setting = Object.assign(GPT_Setting, GPT_SettingResult);
    }
    // GPT_Setting 的变化
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


    // 当前主题的颜色 true:晚上  false:白天
    let Theme = ref(DayOrNight());
    // 查询本地有没有保存过用户 主题使用习惯
    let ThemeResult;
    if (ThemeResult = JSON.parse(localStorage.getItem('Theme'))) {
        Theme.value = ThemeResult;
    }
    // Theme 的变化
    watch(
        () => Theme.value,
        (newTheme) => {
            let result = JSON.stringify(newTheme)
            localStorage.setItem('Theme', result);
            // 通过JavaScript选择HTML元素并添加class
            let htmlElement = document.querySelector("html");
            if (newTheme) {
                htmlElement.classList.add("dark");
            } else {
                htmlElement.classList.remove("dark");
            }
        },
        {
            immediate: true,
        }
    );
    return {
        GPT_Setting, Theme
    }
})
