import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGPTSettingStore = defineStore('GPTSetting', () => {
    // 记录选择的模型
    let Model = ref("gpt-3.5-turbo");
    // 随机性 值越大，回复越随机
    let Temperature = ref(0.5);
    

    return {

    }
})