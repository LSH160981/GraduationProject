import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
export const useParametsSettingStore = defineStore('ParametsSetting', () => {
  // 浏览器视口宽高
  let BrowserWidth = ref(window.innerWidth);
  let BrowserHeight = ref(window.innerHeight);
  // container 宽高
  let ContainerWidth = computed(() => BrowserWidth.value * 0.83)
  let ContainerHeight = computed(() => BrowserHeight.value * 0.83)
  // 当浏览器视口宽度【小于767px 结果为true】 【大于767px 结果为false】
  let w_phone = computed(() => {
    if (BrowserWidth.value >= 767) {
      return false
    }
    return true
  })
  // 在手机状态下 控制 el-drawer 的显示|关闭
  let SliderBarDrawerFlag = ref(false);

  // bottomLeft和bottomRight的高度  ---> top组件 的高度60|45
  let BottomHeight = computed(() => {
    if (w_phone.value) {
      // 小屏幕
      // 浏览器视口高 - 45
      return (BrowserHeight.value - 45)
    } else {
      // 大屏幕
      // 容器高 - top的高 - border(2+2) --> box-sizing:border-box
      return (ContainerHeight.value - 60 - 4)
    }
  })
  // bottomRight -> 对话容器 高
  let BottomRight_ChatContainerHeight = computed(() => {
    if (w_phone.value) {
      // 小屏幕
      return BottomHeight.value * 0.9 - 8
    } else {
      // 大屏幕
      return BottomHeight.value * 0.85 - 8
    }
  })
  // bottomRight -> 输入框 高
  let BottomRight_ChatInputHeight = computed(() => {
    if (w_phone.value) {
      // 小屏幕
      return BottomHeight.value * 0.1 - 8
    } else {
      // 大屏幕
      return BottomHeight.value * 0.15 - 8
    }
  })

  window.addEventListener('resize', () => {
    BrowserWidth.value = window.innerWidth;
    BrowserHeight.value = window.innerHeight;
  });

  return {
    BrowserWidth, w_phone, ContainerWidth, ContainerHeight,
    SliderBarDrawerFlag,
    BottomHeight, BottomRight_ChatContainerHeight, BottomRight_ChatInputHeight
  }
})
