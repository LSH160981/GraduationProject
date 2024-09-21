<script setup>
import {
  ref,
  nextTick,
  watch,
  onBeforeUnmount,
  defineAsyncComponent,
} from 'vue'
import { generateUUID } from '@/utils/GenerateUUID.js'
import {
  CheckZeroWidthChars,
  RemoveZeroWidthChars,
} from '@/utils/ZeroWidthChars'
import { useParametsSettingStore } from '@/stores/ParametsSetting.js'
let ParametsSetting = useParametsSettingStore()

import { useCurrentChatInfoStore } from '@/stores/CurrentChatInfo.js'
let CurrentChatInfo = useCurrentChatInfoStore()

import { useRouter } from 'vue-router'
let $Router = useRouter()

// ChatInput组件元素
const ChatInput = ref(null)
// el-input 组件
let El_Input = ref(null)
// 控制ChatInput组件的高度
let stopWatchChatInput = watch(
  () => ParametsSetting.BottomRight_ChatInputHeight,
  (newValue) => {
    nextTick(() => {
      ChatInput.value.style.MinHeight = `79px`
      ChatInput.value.style.height = `${newValue}px`
    })
  },
  {
    immediate: true,
  }
)

// 发送按钮 点击事件
const SendButton = () => {
  if (
    // 如果 判断为真 说明正在发送网络请求 禁用 SendButton 函数
    CurrentChatInfo.ShowStopButtonFlag ||
    // 简单的校验
    !CurrentChatInfo.InputValue.trim()
  ) {
    return
  }

  // 显示 停止按钮
  CurrentChatInfo.ShowStopButtonFlag = true
  // 添加数据到  CurrentChatInfoStore
  CurrentChatInfo.UserQuestion(CurrentChatInfo.InputValue)
  // 置空
  CurrentChatInfo.InputValue = ''
  let tempUUID
  if (!CurrentChatInfo.uuid) {
    // 新建对话
    // 生成UUID
    tempUUID = generateUUID()
    CurrentChatInfo.ChangeUUID(tempUUID)
  }
  // 通过GPT获取回答
  CurrentChatInfo.GetGPTMsg(() => {
    // 让按钮消失
    CurrentChatInfo.ShowStopButtonFlag = false
    // tempUUID有值  说明是新建对话，所以要改变当前的路由
    tempUUID && $Router.push(`/chat/${tempUUID}`)
  })

  if (ParametsSetting.w_phone) {
    // 手机模式下 发送完信息 input失去焦点
    El_Input.value.blur()
  }
}

// 停止当前对话
const StopFetch = () => {
  // 1.如果用户直接点的话
  if (!CurrentChatInfo.controller) {
    return
  }
  // 2.当你调用了 controller.abort() 函数后, signal.aborted 属性的值将会变为 true。
  if (CurrentChatInfo.signal.aborted) {
    // console.log("AbortController has been used.");
    return
  }
  // 让网络请求停止
  CurrentChatInfo.controller.abort()
  // 置空控制按钮
  CurrentChatInfo.controller = null
  // 让按钮消失
  CurrentChatInfo.ShowStopButtonFlag = false
}

// reload-SVG 旋转的角度
const rotation = ref(0)
// 重新生成对话
const ReloadChat = () => {
  // 旋转的角度 +360
  rotation.value += 360
  // reload-SVG-container 旋转完才执行代码
  setTimeout(() => {
    // 显示 停止按钮
    CurrentChatInfo.ShowStopButtonFlag = true
    // 清除最后 的对话
    CurrentChatInfo.messages.pop()
    CurrentChatInfo.GetGPTMsg(() => {
      // 让 停止对话按钮 消失
      CurrentChatInfo.ShowStopButtonFlag = false
    })
    // 这个时间300ms 对应的是 reload-SVG-container 的旋转时间
  }, 300)
}

// 是否展示 提示词(Prompt组件)
let ShowPromptsFlag = ref(false)

// 确认 提示词(Prompt) 这个函数是传给子组件的
const SurePrompt = (Prompt) => {
  CurrentChatInfo.InputValue = Prompt
  ShowPromptsFlag.value = false
  // 注意这里需要等待DOM加载完毕 直接滚动那时虚拟DOM还没有更新完毕
  nextTick(() => {
    // 让 textarea 滚到底
    El_Input.value.textarea.scrollTop = El_Input.value.textarea.scrollHeight
    // 元素自动聚焦 el-input-textarea
    El_Input.value.textarea.focus() // 原生聚焦
  })
}

// el-input 组件 获得焦点回调
const InputFocus = () => {
  if (CurrentChatInfo.InputValue.charAt(0) === '/') {
    ShowPromptsFlag.value = true
  }
}

// 观察 CurrentChatInfo.InputValue 的变化
let stopWatchCurrentChatInfoInputValue = watch(
  () => CurrentChatInfo.InputValue,
  (newValue) => {
    // 第一个字符以  '/' 开头
    if (newValue.charAt(0) === '/') {
      ShowPromptsFlag.value = true
    } else {
      ShowPromptsFlag.value = false
    }
  }
)

// el-input 组件 Enter 事件
const InputEnterHandler = (event) => {
  // 检测是否按下了Shift + Enter
  if (event.key === 'Enter' && event.shiftKey) {
    // 阻止默认行为（不发送表单等）   textarea 会自动添加换行符
    // event.preventDefault();
    return
  }
  //  区分 正常回车 和 ChatPrompts传参回车

  // 1.判断有没有零宽字符
  if (CheckZeroWidthChars(CurrentChatInfo.InputValue)) {
    // 有 零宽字符 说明是 用回车选择
    // 有的话去除  但是不要 触发 SendButton
    CurrentChatInfo.InputValue = RemoveZeroWidthChars(
      CurrentChatInfo.InputValue
    )
    return
  }

  // 2.正常发送
  SendButton()
}

// 组件销毁
onBeforeUnmount(() => {
  // 停止对 组件 的监视
  stopWatchChatInput()
  // 停止对 CurrentChatInfo.InputValue 的变化 的监视
  stopWatchCurrentChatInfoInputValue()
})
</script>

<template>
  <!-- ChatInput bg-violet-100 -->
  <div ref="ChatInput" class="w-full flex flex-col justify-evenly items-center">
    <!-- 不要让这个按钮 破坏下面的结构 -->
    <div>
      <!-- 停止当前对话按钮 -->
      <div v-if="CurrentChatInfo.ShowStopButtonFlag">
        <el-button link @click="StopFetch">
          <div class="rounded-md flex justify-between items-center gap-1">
            <span>
              <SVG name="stop"></SVG>
            </span>
            <span class="text-[color:var(--setting-color)]">
              停止当前对话
            </span>
          </div>
        </el-button>
      </div>
      <!-- 重新生成按钮 -->
      <div
        v-else-if="
          // 停止当前对话按钮 相反
          !CurrentChatInfo.ShowStopButtonFlag &&
          // 数组必须有长度 大于1 是为了解决 第一个 是MaskPlay的提示词
          CurrentChatInfo.messages.length > 1 &&
          // 最后一个必须是 system
          CurrentChatInfo.messages[CurrentChatInfo.messages.length - 1].role ===
            'system'
        "
      >
        <el-button link @click="ReloadChat">
          <div
            class="rounded-md flex justify-between items-center gap-1 transition-all active:scale-95"
          >
            <!-- reload-SVG-container -->
            <span
              :style="{ transform: `rotate(${rotation}deg)` }"
              class="transition-all duration-300"
            >
              <SVG name="reload" width="22px" height="22px"></SVG>
            </span>
            <span class="text-[color:var(--setting-color)]">
              重新生成对话
            </span>
          </div>
        </el-button>
      </div>
      <!-- 占位 -->
      <div
        v-else="!CurrentChatInfo.ShowStopButtonFlag"
        class="h-[30px] w-[10px] maxd:h-5"
      ></div>
    </div>

    <div class="w-full relative">
      <transition name="fade">
        <ChatPrompts
          v-if="ShowPromptsFlag"
          :InputValue="CurrentChatInfo.InputValue"
          :SurePrompt="SurePrompt"
        >
        </ChatPrompts>
      </transition>

      <el-input
        ref="El_Input"
        type="textarea"
        v-model.lazy="CurrentChatInfo.InputValue"
        @keyup.enter="InputEnterHandler"
        @focus="InputFocus"
        v-focus
        :autosize="{ minRows: 2, maxRows: 3 }"
        resize="none"
        placeholder="Enter 发送, Shift + Enter 换行,  / 触发Prompt"
      >
      </el-input>
      <button
        @click.stop="SendButton"
        class="absolute top-1/2 right-1 -translate-y-1/2"
      >
        <SVG name="send"></SVG>
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: translateY(100%); /* 初始状态从下方开始 */
}
.fade-enter-active {
  transition: all 0.5s ease-out; /* 使用 ease-out 缓动效果更自然 */
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0); /* 结束状态回到原位 */
}
</style>
