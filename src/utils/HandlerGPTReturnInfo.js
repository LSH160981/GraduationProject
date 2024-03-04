import { ElMessage } from "element-plus";
import { useSettingStore } from "@/stores/Setting.js";
let Setting = useSettingStore();

/**
 * @param {RefImpl} messages 响应式数据 
 * @param {AbortSignal} signal 响应式数据 终止网络请求的标记
 * @param {Function} callback 回调函数  在执行完所有的的代码后才会运行这个函数
 * @returns undefind
 */
export const HandlerGPTReturnInfo = async (messages, signal, callback) => {
    // console.log(messages); // 输出的是一个代理对象
    const apiUrl = "https://api.chatanywhere.com.cn/v1/chat/completions";
    const AI_API_KEY = "sk-foH2NFqFeSDLfj3OiCttrsB0Gza9JZBYBwE9RutauvBc5ipD";
    // 请求体
    const requestBody = {
        model: Setting.GPT_Setting.Model,
        temperature: Setting.GPT_Setting.Temperature,
        max_tokens: Setting.GPT_Setting.Max_tokens,
        presence_penalty: Setting.GPT_Setting.Presence_penalty,
        frequency_penalty: Setting.GPT_Setting.Frequency_penalty,
        n: Setting.GPT_Setting.N,
        messages: messages.value,
        stream: true, // 开启流式读取
    };
    // 请求参数: 方式 请求头 请求体的JSON格式 网络终止型号
    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${AI_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
        signal: signal.value
    };
    // 发起Fetch请求
    let response = await fetch(apiUrl, fetchOptions)
    // 返回的 数据 异常 处理
    if (!response.ok) {
        let errorData = await response.json();
        ElMessage({
            message: `网络请求发生错误,请切换 model(gpt-3.5-turbo) 或者联系-小廖`,
            type: "error",
            duration: 3500
        });
        throw new Error(`请求出错啦！错误码${errorData.error.code}`)
    }
    // 添加一个空的
    messages.value.push({ role: "system", content: "" })
    // 流式读取
    let reader = response.body.getReader();
    let decoder = new TextDecoder();
    while (true) {
        let { done, value } = await reader.read();
        if (done) { break; }
        let content = decoder.decode(value);
        messages.value[messages.value.length - 1].content += handlerStr(content)
        // console.log(handlerStr(content)); 
    }
    // 当数据处理完毕 使用短路技巧 执行回调 
    callback && callback()
}

/**
 * 用于处理字节流返回的数据
 * @param {String} str 
 * @returns String
 */
const handlerStr = (str) => {
    let result_str = '';
    str.replace(/("[^"]*")|\s/g, (_, capture) => {
        // 如果匹配到双引号内的内容，则保留原样，否则删除空格
        return capture ? capture : '';
    })
        .replace(/\[DONE\]/g, '')  // 去除 [DONE]
        .replace(/data:/g, '\n')   // 将 data: 替换为换行符
        .split("\n")               // 按换行符分割字符串
        .filter(Boolean)           // 去除空项
        .map(item => JSON.parse(item))     // 解析 JSON，并返回新数组
        .forEach((item) => {
            if (item.choices[0].delta.content) {
                result_str += item.choices[0].delta.content;
            }
        });
    return result_str;
};