import { ref, watch, toRaw, computed, isProxy } from 'vue'
import { defineStore } from 'pinia'

export const useGlobalInformationStore = defineStore('GlobalInformation', () => {
  let AllChatInfo = ref([])
  // 从本地拿数据
  if (AllChatInfo.value.length === 0) {
    let result = JSON.parse(localStorage.getItem('AllChatInfo'))
    AllChatInfo.value = result ? result : []
  }
  // 数据一旦发生变化，要改变本地存储信息
  watch(
    () => AllChatInfo.value,
    (newValue) => {
      let result = JSON.stringify(toRaw(newValue))
      localStorage.setItem('AllChatInfo', result);
    },
    {
      immediate: true,
      deep: true
    })

  // 获取对话的全部UUID
  let AllUUID = computed(() => {
    let result = [];
    AllChatInfo.value.forEach((item) => {
      result.push(item.uuid);
    })
    return result
  })

  // 通过UUID 查询有没有这个对话 
  const GetChatInfoByUUID = (uuid) => {
    let result = {};
    AllChatInfo.value.forEach((item) => {
      if (item.uuid === uuid) {
        result = item
      }
    })
    if (result) {
      return result
    } else {
      // 报错
      throw new Error("该UUID无效")
    }
  };

  // 通过UUID更改 某一个对话的title
  const ChangeChatTitleByUUID = (uuid, title) => {
    AllChatInfo.value.forEach((item) => {
      if (item.uuid === uuid) {
        item.title = title;
      }
    })
  }

  // 通过UUID更改 某一个 对话
  const ChangeChatMessagesByUUID = (uuid, messages) => {
    AllChatInfo.value.forEach((item) => {
      if (item.uuid === uuid) {
        item.messages = messages;
      }
    })
  }

  // 通过UUID删除某一个对话
  const DeleteChatByUUID = (uuid) => {
    AllChatInfo.value = AllChatInfo.value.filter(chat => chat.uuid !== uuid);
  }

  // 添加新的对话
  const AddChat = (newChat) => {
    // 新加进来的数据 依旧是代理对象 实现了 数据联动
    // console.log(isProxy(newChat.messages)); // true
    // 新的对话中必须要有 uuid title 对话有长度
    if (newChat.uuid && newChat.title && newChat.messages.length > 0) {
      // unshift 从上面插入数据
      AllChatInfo.value.unshift(newChat)
    } else {
      throw new Error("缺少对应属性")
    }
  }

  return {
    AllChatInfo, AllUUID,
    DeleteChatByUUID, ChangeChatTitleByUUID, ChangeChatMessagesByUUID,
    GetChatInfoByUUID, AddChat
  }
})
