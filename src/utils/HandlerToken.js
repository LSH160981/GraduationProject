/**
 * 获取指定名称的Token
 * @param {string} name - 需要获取的Token的名称
 * @returns {string} 返回得到的Token，如果未找到则返回null
 */
export const GetToken = (name) => {
    let token = localStorage.getItem(name);
    return token ? token : null;
}

/**
 * 设置指定名称的Token
 * @param {string} name - 需要设置的Token的名称
 * @param {string} value - 需要设置的Token的值
 * @returns {void} 无返回值
 */
export const SetToken = (name, value) => {
    localStorage.setItem(name, value);
}

/**
 * 删除指定名称的Token
 * @param {string} name - 需要删除的Token的名称
 * @returns {void} 无返回值
 */
export const DeleteToken = (name) => {
    localStorage.removeItem(name);
}