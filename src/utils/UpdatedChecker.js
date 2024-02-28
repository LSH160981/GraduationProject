// 代码每 10 秒检查一次 网页 文件是否有更新。

// 立即执行函数,其实就是一个作用域
(() => {
    // 获取当前时间戳
    const timestamp = Date.now();
    // 基础完整的路径
    const base_url = window.location.origin;
    // src 的值
    let src_arr = Get_src();
    // setInterval 的 id
    let timeID;

    // 1.获取整个页面的数据 加上时间戳，就是为了避免有缓存
    // 2.提取所有 <script></script> 中的src 并用 返回一个新的 数组
    async function Get_src() {
        const result_arr = new Set();
        await fetch(`${base_url}/?${timestamp}`, {
            cache: 'no-cache',
        })
            .then((response) => response.text())
            .then((html) => {
                // 2.提取所有 <script></script> 中的src 并用 result_arr 数组保存起来
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const scripts = doc.querySelectorAll('script');
                for (const script of scripts) {
                    if (script.src) {
                        result_arr.add(script.src);
                    }
                }
            });
        return result_arr;
    }

    // 信息提示框
    function ConfirmationBox() {
        // 暂停定时器
        clearInterval(timeID);
        // 交互提示
        if (!confirm("发现新版本,请更新页面")) {
            // 用户点击了取消   说明用户不更新 不用继续轮询了
            // 当前除非是强制更新
            return;
        }
        // 用户点击了确认--->刷新页面
        window.location.href = "/";
        window.location.reload();
    }

    // 检测更新
    function UpdatedChecker() {
        // 临时保存的值
        const src_temp = Get_src();
        // 对比 src_arr | src_temp
        // 1.完全相等, 函数结束
        // 2.但凡有一个不相等 提示用户刷新页面
        if (src_temp.size === src_arr.size && [...Array.from(src_temp)].every((item) => src_arr.has(item))) {
            // console.log('完全一样');
            return;
        }
        // console.log('不一样');
        ConfirmationBox();
    }

    // 检查轮询
    function CheckPolling() {
        // 每 10 秒检查一次
        timeID = setInterval(() => {
            UpdatedChecker();
        }, 10000);
    }

    // 开启轮询检测
    CheckPolling();
})();
