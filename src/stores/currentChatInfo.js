import { ref, computed, watch, nextTick } from 'vue'
import { defineStore } from 'pinia'
import { HandlerGPTReturnInfo } from '@/utils/HandlerGPTReturnInfo.js';
import { useGlobalInformationStore } from './GlobalInformation.js'
// let { GetChatMessagesByUUID, AddChat, AllUUID } = useGlobalInformationStore();
let GlobalInformation = useGlobalInformationStore();

export const useCurrentChatInfoStore = defineStore('CurrentChatInfo', () => {

  let uuid = ref("");
  let messages = ref([]);
  let title = computed(() => {
    if (messages.value.length <= 0) {
      return "New Chat"
    }
    let result = messages.value.find((item) => item.role == "user")
    return result.content
  });

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
        console.log('新建');
        messages.value = []
        return
      }

      // 本地就有的对话  1.点击 sliderbaritem 传过来的uuid
      if (GlobalInformation.AllUUID.includes(newValue)) {
        messages.value = GlobalInformation.GetChatMessagesByUUID(newValue)
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
    },
  )

  // 通过GPT获取问题的答案
  const GetGPTMsg = () => {
    // 设置一个终止信号
    const controller = new AbortController();
    const signal = controller.signal;

    // 这里再做一些判断
    // 
    HandlerGPTReturnInfo(messages, "gpt-3.5-turbo", signal)

    function abort() {
      controller.abort()
    }
    // 把停止功能返回出去
    return {
      abort
    }
  }


  return {
    uuid
    , title, messages, ChangeUUID, UserQuestion, GetGPTMsg,
  }
})
