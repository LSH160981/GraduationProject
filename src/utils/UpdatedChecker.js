// 立即执行函数,其实就是一个作用域
(() => {
    // 检测代码运行的时间间隔
    let duration = 10000;
    // 基础完整的路径
    const base_url = window.location.origin;
    let src_arr = new Set();
    let timeID;

    // 获取整个页面的数据 加上时间戳，就是为了避免有缓存
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

    async function UpdatedChecker() {
        const src_temp = new Set([...src_arr]);
        await Get_src();
        if (src_temp.size === src_arr.size && [...src_temp].every(item => src_arr.has(item))) {
            return;
        }
        ConfirmationBox();
    }

    function ConfirmationBox() {
        clearInterval(timeID);
        if (!confirm("发现新版本,请更新页面")) {
            return;
        }
        window.location.reload();
    }

    function CheckPolling() {
        timeID = setInterval(UpdatedChecker, duration); // 每 10 秒检查一次
    }

    async function init() {
        await Get_src(); // 初始获取页面数据
        CheckPolling(); // 开启轮询检测
    }

    /**
     * development ：这是在开发环境中常见的值，此时项目处于开发阶段。
     * production ：这是在生产环境中常见的值，此时项目已经部署并对外提供服务。
    */
    // 在开发环境中 就不要检测
    if (process.env.NODE_ENV === "development") {
        return
    } else {
        // 初始化
        init();
    }
})();
