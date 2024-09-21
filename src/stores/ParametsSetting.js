import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
export const useParametsSettingStore = defineStore('ParametsSetting', () => {
  // 浏览器视口宽高
  let BrowserWidth = ref(window.innerWidth)
  let BrowserHeight = ref(window.innerHeight)
  // container 宽高
  let ContainerWidth = computed(() => BrowserWidth.value * 0.83)
  let ContainerHeight = computed(() => BrowserHeight.value * 0.83)
  /*
  当浏览器视口宽度【小于767px 结果为true】 【大于767px 结果为false】
  */
  let w_phone = computed(() => {
    if (BrowserWidth.value >= 767) {
      return false
    }
    return true
  })
  // 在手机状态下 控制 el-drawer 的显示|关闭
  let SliderBarDrawerFlag = ref(false)

  // bottomLeft和bottomRight的高度  ---> top组件 的高度60|45
  let BottomHeight = computed(() => {
    if (w_phone.value) {
      // 小屏幕
      // 浏览器视口高 - 45
      return BrowserHeight.value - 45
    } else {
      // 大屏幕
      // 容器高 - top的高 - border(2+2) --> box-sizing:border-box
      return ContainerHeight.value - 60 - 4
    }
  })
  // bottomRight -> 对话容器 高
  let BottomRight_ChatContainerHeight = computed(() => {
    return BottomHeight.value * 0.85 - 8
  })
  // bottomRight -> 输入框 高
  let BottomRight_ChatInputHeight = computed(() => {
    return BottomHeight.value * 0.15 - 8
  })
  // 在layout.vue文件中 决定 BottomLeft BottomRight 的宽占比 (el-plus的el-col)
  let BottomLeftWidth = ref(6)
  let BottomRightWidth = ref(18)
  // 在特定情况下 修改 BottomLeftWidth BottomRightWidth 的值
  const ChangeBottomWidth = () => {
    // 必须是大屏幕才能 作数
    if (w_phone.value) {
      return
    }

    if (BottomLeftWidth.value === 6) {
      // 左6 右18 ---> 左0 右24
      BottomLeftWidth.value = 0
      BottomRightWidth.value = 24
    } else if (BottomLeftWidth.value === 0) {
      // 左0 右24 ---> 左6 右18
      BottomLeftWidth.value = 6
      BottomRightWidth.value = 18
    }
  }
  // 查询本地有没有保存过用户 使用 BottomLeftWidth 的习惯 由于保存的数据有0 不要直接解析出来 会影响下面的if的判断
  let BottomLeftWidth_LocalStorage =
    localStorage.getItem('BottomLeftWidth') || null
  if (BottomLeftWidth_LocalStorage) {
    // BottomLeftWidth_LocalStorage typeof is string
    let temp_res = +JSON.parse(BottomLeftWidth_LocalStorage)
    BottomLeftWidth.value = temp_res
    BottomRightWidth.value = 24 - temp_res
  }
  // BottomLeftWidth 的变化
  watch(
    () => BottomLeftWidth.value,
    (newValue) => {
      localStorage.setItem('BottomLeftWidth', newValue)
    }
  )

  // 当页面的尺寸发生变化时
  window.addEventListener('resize', () => {
    BrowserWidth.value = window.innerWidth
    BrowserHeight.value = window.innerHeight
    SliderBarDrawerFlag.value = false
  })

  return {
    BrowserWidth,
    BrowserHeight,
    w_phone,
    ContainerWidth,
    ContainerHeight,
    SliderBarDrawerFlag,
    BottomHeight,
    BottomRight_ChatContainerHeight,
    BottomRight_ChatInputHeight,
    BottomLeftWidth,
    BottomRightWidth,
    ChangeBottomWidth,
  }
})
