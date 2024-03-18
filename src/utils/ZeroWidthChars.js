// 这个文件是 有关 零宽字符的处理

// 判断 字符串中有没有零宽字符 有返回true 没有返回false
export const CheckZeroWidthChars = (str) => {
    // 正则表达式匹配常见的零宽字符
    const Pattern = /[\u200B-\u200D\uFEFF\u2060]/g;
    return Pattern.test(str);
};


// 移除字符串中的零宽字符
export const RemoveZeroWidthChars = (str) => {
    // 正则表达式匹配常见的零宽字符
    const zeroWidthCharsPattern = /[\u200B-\u200D\uFEFF\u2060]/g;
    return str.replace(zeroWidthCharsPattern, "");
}

// 给字符串添加(头部开始) 零宽字符
export const AddZeroWidthChars = (str, ZeroWidthChars = '\u200B') => {
    return ZeroWidthChars + str
}