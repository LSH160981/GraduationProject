import { animationFrameTimer } from '@/utils/Animate.js';
import { ElNotification } from 'element-plus';
(() => {
  const duration = 20 * 1000; // 检测代码运行的时间间隔
  const base_url = window.location.origin; // 基础完整的路径
  let src_arr = new Set(); // 存储 script 标签的 src
  let lastCheckTime = Date.now(); // 上次检测时间
  let Frame = null; // 接收animationFrameTimer的返回值

  // 获取整个页面的数据，加上时间戳避免缓存
  async function Get_src() {
    const timestamp = Date.now();
    try {
      const response = await fetch(`${base_url}/?${timestamp}`, {
        cache: 'no-cache',
      });
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const scripts = doc.querySelectorAll('script');
      for (const script of scripts) {
        if (script.src) {
          src_arr.add(script.src);
        }
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
    }
  }

  // 检查是否有新的版本
  async function UpdatedChecker() {
    const src_temp = new Set(src_arr);
    await Get_src();
    if (src_temp.size !== src_arr.size || ![...src_temp].every((item) => src_arr.has(item))) {
      ConfirmationBox();
    }
  }

  // 提示用户10s后刷新页面
  function ConfirmationBox() {
    // if (confirm('发现新版本,请更新页面')) {
    //   window.location.reload();
    // }
    ElNotification({
      type: 'success',
      duration: 3000,
      message: `将在10s后刷新页面`,
      title: `发现新版本`,
      position: 'bottom-right',
    });
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }

  // 轮询检测函数
  function CheckPolling() {
    const now = Date.now();
    if (now - lastCheckTime >= duration) {
      UpdatedChecker();
      lastCheckTime = now;
    }
  }

  // 初始化函数
  async function init() {
    await Get_src(); // 初始获取页面数据
    Frame = animationFrameTimer(CheckPolling); // 使用 animationFrameTimer 开启轮询检测
  }

  // 当用户离开页面(切换标签页|切换应用)时，停止轮询检测
  window.addEventListener('beforeunload', () => {
    Frame && Frame.stop();
  });
  // 当用户回到页面时，重新开始轮询检测
  window.addEventListener('load', init);

  // 执行初始化
  init();
})();
