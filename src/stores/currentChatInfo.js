import { ref, toRaw, watch, nextTick, isProxy } from 'vue'
import { defineStore } from 'pinia'
import { HandlerGPTReturnInfo } from '@/utils/HandlerGPTReturnInfo.js';
import { useGlobalInformationStore } from './GlobalInformation.js'
let GlobalInformation = useGlobalInformationStore();

export const useCurrentChatInfoStore = defineStore('CurrentChatInfo', () => {
  let uuid = ref("");
  let messages = ref([]);
  let title = ref("New Chat")
  // 设置一个终止信号
  let controller = ref(null);
  let signal = ref(null);

  // 用户的提问
  const UserQuestion = (content) => {
    let obj = {
      role: "user",
      content
    }
    messages.value.push(obj)
  }

  // 改变UUID
  const ChangeUUID = (uuidStr) => {
    uuid.value = uuidStr

  }

  /**
   * uuid 变化
   * 1.点击 sliderbaritem 传过来的
   * 2.新对话 重新生成的uuid bottomRight 传过来
   * 3.点击新建聊天 --> 清空UUID
   */
  watch(
    () => uuid.value,
    (newValue) => {
      console.log("current uuid改动了");

      // 3.点击新建聊天 --> 清空UUID
      if (!newValue) {
        console.log('新建对话');
        messages.value = []
        return
      }

      // 本地就有的对话  1.点击 sliderbaritem 传过来的uuid
      if (GlobalInformation.AllUUID.includes(newValue)) {
        let result = GlobalInformation.GetChatInfoByUUID(newValue)
        // console.log(isProxy(result.messages)); // true
        // 数据在这里实现 数据联动
        messages.value = result.messages;
        title.value = result.title;
      } else {
        // 2.新对话 重新生成的uuid bottomRight 传过来
        //  bottomRight 传过来的话，肯定由 chatInput.vue 提供第一个问题
        let TempChatInfo = {
          uuid: newValue,
          title: title.value,
          messages: messages.value
        }
        // 存储到大仓库
        GlobalInformation.AddChat(TempChatInfo)
        // 新对话 
        console.log("New Chat");
      }
      // 添加类样式
      nextTick(() => {
        // 加到微队列
        Promise.resolve().then(() => {
          // 获取所有带有 'uuid' 属性的元素
          let elements = document.querySelectorAll("[uuid]");
          // 遍历元素 排他 上样式
          elements.forEach((element) => {
            let element_uuid = element.getAttribute("uuid");
            element.classList.remove("bg-gray-300");
            if (element_uuid === newValue) {
              element.classList.add("bg-gray-300");
            }
          });
        })
      })

      // uuid 变化的时候 有网络请求就 中断网课请求，没有就算了
      if (controller.value === null) {
        // 进入这里说明没有发起过网络请求 什么都不干
      } else {
        // 进入这里说明 有网络请求进行中，却突然改了uuid
        // 有网络请求，就要停止
        controller.value.abort()
        // 仓库的终止信号 置空
        controller.value = null
        signal.value = null
      }
    },
  )

  /**
   * messages 变化
   * 要确定当前对话的title
   */
  watch(
    () => messages.value,
    (newValue) => {
      if (toRaw(newValue).length <= 0) {
        return
      }
      let result = newValue.find((item) => item.role == "user")
      // title  不要太长 32就够了
      title.value = result.content.substring(0, 32)
    },
    {
      deep: true,
    }
  )

  // 通过GPT获取问题的答案
  const GetGPTMsg = (callback) => {
    // 每次调用该函数 就设置一次新的终止信号
    controller.value = new AbortController();
    signal.value = controller.value.signal;

    // 这里再做一些判断 
    // 处理网路返回的信息
    HandlerGPTReturnInfo(messages, "gpt-3.5-turbo", signal, () => {
      // 这个callback 是 chatInput.vue 的
      callback && callback()
      // 下面这部分是 currentChatInfo.js 的
      // 网络请求结束后把 仓库的终止信号 置空
      controller.value = null
      signal.value = null
    })
  }


  return {
    uuid, title, messages, ChangeUUID, UserQuestion, GetGPTMsg,
    controller, signal
  }
})
