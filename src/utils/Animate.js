// 定义一个函数，该函数接收一个回调函数作为参数
// 只有当每一帧之间的时间大于16毫秒时，才会调用该回调函数
function animationFrameTimer(callback, gapTime = 16) {
    // 初始化上一帧的时间戳
    let lastFrameTime = null;

    // 定义步骤函数，它将被 requestAnimationFrame 调用
    function step(timestamp) {
        // 如果上一帧时间未设置，则将当前时间戳设置为上一帧时间
        if (!lastFrameTime) lastFrameTime = timestamp;
        // 计算从上一帧到现在过去了多少时间
        let timeSinceLastFrame = timestamp - lastFrameTime;

        // 如果两帧空闲的时间大于等于16毫秒，则执行回调函数
        if (timeSinceLastFrame >= gapTime) {
            callback && callback(); // 执行传入的回调函数
            lastFrameTime = timestamp; // 更新上一帧的时间戳
        }

        // 继续请求下一帧动画，当浏览器准备好下一帧时，step 函数将再次被调用
        requestAnimationFrame(step);
    }

    // 请求第一帧动画，开始循环
    requestAnimationFrame(step);
}

// 导出
export { animationFrameTimer };
