import { ref, toRaw, watch, nextTick } from 'vue';
import { defineStore } from 'pinia';
import { HandlerGPTReturnInfo } from '@/utils/HandlerGPTReturnInfo.js';
import { useGlobalInformationStore } from './GlobalInformation.js';
let GlobalInformation = useGlobalInformationStore();

export const useCurrentChatInfoStore = defineStore('CurrentChatInfo', () => {
  // 输入框的值
  let InputValue = ref('');
  let uuid = ref('');
  let messages = ref([]);
  // 控制 停止对话的按钮 是否显示
  let ShowStopButtonFlag = ref(false);
  // 设置一个终止信号
  let controller = ref(null);
  let signal = ref(null);

  // 用户的提问
  const UserQuestion = (content) => {
    let obj = {
      role: 'user',
      content,
    };
    messages.value.push(obj);
  };

  // 改变UUID
  const ChangeUUID = (uuidStr) => {
    uuid.value = uuidStr;
  };

  /**
   * 通过 当前uuid 确定给 哪一个slideritem 加上类样式 border-green-500
   * SliderItem 点击之后 通过TWCSS改变 border
   */
  const SliderItemChangeBorder = async () => {
    // 等待页面的 dom 更新完毕，采取执行下面的代码
    await nextTick();
    // 获取所有带有 'uuid' 属性的元素
    let elements = document.querySelectorAll('[uuid]');
    // 遍历元素并打印 uuid
    elements.forEach((element) => {
      let element_uuid = element.getAttribute('uuid');
      element.classList.remove('border-green-500');
      if (element_uuid === uuid.value) {
        element.classList.add('border-green-500');
      }
    });
  };

  /**
   * uuid 变化
   * 1.点击 sliderbaritem 传过来的
   * 2.新对话 重新生成的uuid bottomRight 传过来
   * 3.点击新建聊天 --> 清空UUID
   */
  watch(
    () => uuid.value,
    (newValue, oldValue) => {
      console.log('current uuid改动了');
      InputValue.value = '';

      SliderItemChangeBorder();

      // 3.点击新建聊天 --> 清空UUID
      if (!newValue) {
        // console.log('新建对话 current uuid为空');
        messages.value = [];
        // 让chatInput.vue 中的停止按钮 消失
        ShowStopButtonFlag.value = false;
        // 如果是新建对话  1.本来就是空的发起了对话，2.是别的对话来的 --> 终止之前的对话
        if (controller.value != null) {
          // 如果不停止对话 @/utils/HandlerGPTReturnInfo.js 就要报错了
          controller.value.abort();
        }
        return;
      }

      // 本地就有的对话  1.点击 sliderbaritem 传过来的uuid
      if (GlobalInformation.AllUUID.includes(newValue)) {
        let result = GlobalInformation.GetChatInfoByUUID(newValue);
        // console.log(isProxy(result.messages)); // true
        // 数据在这里实现 数据联动
        messages.value = result.messages;
        // title.value = result.title;
      } else {
        // console.log('新建对话 current uuid 有值');
        let TempTitle = messages.value.find((item) => item.role == 'user');
        // 2.新对话 重新生成的uuid 其他的组件 传过来
        let TempChatInfo = {
          uuid: newValue,
          title: TempTitle ? TempTitle.content : 'New Chat',
          messages: messages.value,
        };
        // 存储到大仓库
        GlobalInformation.AddChat(TempChatInfo);
      }

      // uuid 变化的时候 有网络请求,就中断网络请求; 没有就算了
      if (controller.value === null) {
        // 进入这里说明没有发起过网络请求 什么都不干
      } else {
        // oldValue 为空 说明要新建一个对话  不要中断对话
        // oldValue 有数据 是从别的对话过来的 中断对话
        if (oldValue) {
          // 进入这里说明 有网络请求进行中，却突然改了uuid
          // 有网络请求，就要停止
          controller.value.abort();
          // 仓库的终止信号 置空
          controller.value = null;
          signal.value = null;
        }
      }
    },
    {
      immediate: true,
    }
  );

  // 值为真 运行当前对话更改大仓库的标题。false：不允许
  let changeTltleFlag = ref(false);
  /**
   * messages 变化
   */
  watch(
    () => messages.value,
    (newValue) => {
      if (toRaw(newValue).length <= 0) {
        return;
      }
      // 第一个角色必须是 system 也就是从 MaskPlay.vue 来的才允许更改
      if (newValue[0].role == 'system') {
        let result = newValue.find((item) => item.role == 'user');
        // 有结果 且 changeTltleFlag 为真
        if (result && changeTltleFlag.value) {
          GlobalInformation.ChangeChatTitleByUUID(uuid.value, result.content);
          // 这里表示每一次新对话只允许改一次
          changeTltleFlag.value = false;
        }
      }
    },
    { deep: true }
  );

  // 检测 controller 如果为空,说明网络 中断了 按钮也要消失
  watch(
    () => controller.value,
    (newValue) => {
      if (newValue === null) {
        // 进入这个判断说明 GPT发送的网络请求中断了  | 或者压根就没有发送过请求
        // 无论是哪一种，都要让按钮消失
        // 让按钮消失
        ShowStopButtonFlag.value = false;
      }
    }
  );

  // 通过GPT获取问题的答案
  const GetGPTMsg = async (callback) => {
    // 每次调用该函数 就设置一次新的终止信号
    controller.value = new AbortController();
    signal.value = controller.value.signal;
    try {
      // 处理网路返回的信息
      await HandlerGPTReturnInfo(messages, signal, () => {
        // 下面这部分是 currentChatInfo.js 的
        // 网络请求结束后把 仓库的终止信号 置空
        controller.value = null;
        signal.value = null;
        // 这个callback 是 chatInput.vue(调用了两次) 的
        callback && callback();
      });
    } catch (_) {
      // console.log(error);
      // 关闭 停止对话的按钮
      ShowStopButtonFlag.value = false;
    }
  };

  return {
    ShowStopButtonFlag,
    InputValue,
    uuid,
    messages,
    ChangeUUID,
    UserQuestion,
    GetGPTMsg,
    SliderItemChangeBorder,
    controller,
    signal,
    changeTltleFlag,
  };
});
