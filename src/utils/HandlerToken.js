import { ElMessage } from "element-plus";
import router from "@/router/index.js"; // 引入路由

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

/**
 * 清除本地  所有的 localStorage 存储的数据
 * @returns {void} 无返回值
 */
export const ClearAll = () => {
    // 移除本页面 所有 相关数据
    localStorage.clear();
}

// 用于控制 该验证函数 只能运行一次
let VerifyFlag = true;
/**
 * 验证token 是否有效
 * @returns {void} 无返回值
 */
export const VerifyToken = (token) => {
    if (!VerifyFlag) {
        return;
    }
    if (!token) {
        return new Error(`缺少参数token`);
    }
    // 1.发送请求，看看token 有没有过期
    let url = `${import.meta.env.VITE_APP_BASE_URL}/?token=${token}`;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            if (result.status === 200) {
                // 1.1 有效 无事发生
                // console.log("token有效");
            } else {
                // 1.2 无效 清除本地token 以及 其他所有的 localStorage存储的数据
                // console.log("token无效");
                ElMessage({
                    message: `Token过期,请重新登录`,
                    type: "error",
                    duration: 3500,
                });
                ClearAll();
                // 路由跳到 登录页面
                router.push("/login");
            }
        });
    // 该函数 只能运行一次，完毕后将改为false
    VerifyFlag = false;
}