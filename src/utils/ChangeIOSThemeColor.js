/**
 * 针对IOS的背景颜色 对PC端没有效果
 * 改变head标签中 meta有关苹果主题的颜色
 * 当然必须要有对应的mate标签这个才会起作用
 * @param {string} color 颜色的16进制
 */
const ChangeIOSThemeColor = (color) => {
    // 获取标签
    let metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
        // 更改标签的content
        metaThemeColor.setAttribute("content", color);
    }
}

export default ChangeIOSThemeColor
