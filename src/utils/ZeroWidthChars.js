// 这个文件是有关零宽字符的处理

// 定义零宽字符的正则表达式和默认值
const ZERO_WIDTH_CHARS_PATTERN = /[\u200B-\u200D\uFEFF\u2060]/g
const DEFAULT_ZERO_WIDTH_CHAR = '\u200B'

/**
 * 判断字符串中有没有零宽字符
 * @param {string} str - 需要检查的字符串
 * @returns {boolean} - 有零宽字符返回true，没有返回false
 */
export const CheckZeroWidthChars = (str) => ZERO_WIDTH_CHARS_PATTERN.test(str)

/**
 * 移除字符串中的零宽字符
 * @param {string} str - 需要处理的字符串
 * @returns {string} - 移除零宽字符后的字符串
 */
export const RemoveZeroWidthChars = (str) => str.replace(ZERO_WIDTH_CHARS_PATTERN, '')

/**
 * 给字符串添加零宽字符
 * @param {string} str - 需要添加零宽字符的字符串
 * @param {string} zeroWidthChars - 要添加的零宽字符，默认为DEFAULT_ZERO_WIDTH_CHAR
 * @returns {string} - 添加零宽字符后的字符串
 */
export const AddZeroWidthChars = (str, zeroWidthChars = DEFAULT_ZERO_WIDTH_CHAR) => zeroWidthChars + str
