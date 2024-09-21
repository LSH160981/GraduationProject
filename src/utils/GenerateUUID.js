/**
 * 返回UUID -- 为了兼容更多的浏览器做出适配
 * @returns {String} 生成的UUID
 */
export const generateUUID = () => {
  try {
    // 尝试使用内置的随机UUID生成器
    if (crypto.randomUUID) {
      return crypto.randomUUID()
    }
    // 后备方案：使用其他方法生成UUID
    return secureUUID()
  } catch (error) {
    console.error('生成UUID失败:', error)
    return null // 返回null表示生成失败
  }
}

const secureUUID = () => {
  try {
    // 创建一个16字节的数组来保存UUID
    const buf = new Uint8Array(16)
    // 使用crypto API生成随机值填充数组
    crypto.getRandomValues(buf)
    // 设置UUID的版本和变体
    buf[6] = (buf[6] & 0x0f) | 0x40 // UUID version 4
    buf[8] = (buf[8] & 0x3f) | 0x80 // UUID variant 10xxx
    // 将字节数组转换为UUID格式的字符串
    return [...buf]
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5')
  } catch (error) {
    console.error('生成安全UUID失败:', error)
    return null // 返回null表示生成失败
  }
}
