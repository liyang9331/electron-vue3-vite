import request from "@/api/request";

// 测试api
export function rubbish (data) {
    return request({
        url: 'https://api.oioweb.cn/api/ai/rubbish',
        method: 'post',
        data
    })
}