import request from "@/api/request";

// // 测试api
export function rubbish(data: any) {
    return request({
        url: 'https://api.oioweb.cn/api/ai/rubbish',
        method: 'post',
        data
    })
}

// 卡片识别
export function cardRecognition(data: any) {
    return request({
        url: '/client/device/cardRecognition',
        method: 'post',
        data
    })
}

// 打开串口
export function openSerial(data: any) {
    return request({
        url: '/client/device/openSerial',
        method: 'post',
        data
    })
}


// 圈存操作
export function entrap(data: any){
    return request({
        url: '/client/device/entrap',
        method: 'post',
        data
    })
}

// 查询卡片信息
export function queryCardInfo(data: any){
    return request({
        url: '/client/device/queryCardInfo',
        method: 'post',
        data
    })
}

// 查询充值记录
export function queryUserPayRecord(data: any){
    return request({
        url: '/client/device/queryUserPayRecord',
        method: 'post',
        data
    })
}

// 查询待圈存
export function queryWaitEntrap(data: any){
    return request({
        url: '/client/device/queryWaitEntrap',
        method: 'post',
        data
    })
}

// 测试推送卡片信息
export function testCode(params: any){
    return request({
        url: '/client/device/queryUserPayRecord',
        method: 'get',
        params
    })
}