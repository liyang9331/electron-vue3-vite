<template>
    <div class="page">
        <div class="text">请扫码支付</div>
        <!-- 二维码 -->
        <div class="qrcode_parent">
            <div class="qrcode"></div>
            <div class="qrcode_text">打开手机扫码支付（微信、支付宝、银联）</div>
        </div>
    </div>
    <div class="button_parent">
        <ubutton @handler="goback()" :text="'返回'" :model="1"></ubutton>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import { useMainStore } from "@/stores/index"
import ubutton from "@/components/button.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const amount = route.params.amount

setTimeout(()=>{
    // 支付状态
    const state:any = "true"
    router.push({
        name: "rechargeTips",
        params: { state:state,amount:amount }
    })
},2000)
function goback() {
    router.go(-1)
}
</script>

<style lang="less" scoped>
.page {
    width: 1430px;
    height: 734px;
    background: #FFFFFF;
    box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.08);
    border-radius: 20px 20px 20px 20px;
    opacity: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .text {
        position: absolute;
        top: 60px;
        left: 50px;
        font-size: 36px;
        font-family: Source Han Sans CN-Bold, Source Han Sans CN;
        font-weight: bold;
        color: #333333;
        line-height: 0px;
        // -webkit-background-clip: text;
        // -webkit-text-fill-color: transparent;
    }


    .qrcode_parent {
        // max-width: 263px;
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // flex-wrap: wrap;

        .qrcode {
            margin: 0 auto;
            width: 263px;
            height: 263px;
            background: #FFFFFF;
            border-radius: 0px 0px 0px 0px;
            opacity: 1;
            border: 1px solid #707070;
        }

        .qrcode_text {
            margin-top: 40px;
            font-size: 26px;
            font-family: Source Han Sans CN-Medium, Source Han Sans CN;
            font-weight: 500;
            color: #666666;
            line-height: 0px;
            -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
        }
    }
}
</style>