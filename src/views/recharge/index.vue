<template>
    <div class="top" style="">
        <div class="top-left">
            <div>
                <p class="left-text"><span>姓名:</span><span>{{ system.card.cardInfo?.fullName }}</span></p>
                <p class="left-text"><span>卡号:</span><span>{{ system.card.cardInfo?.cardNo }}</span></p>
                <p class="left-text"><span>剩余电量:</span><span>{{ system.card.cardInfo?.available }}度</span></p>
            </div>
        </div>
        <div class="fingerboard" style="">
            <div class="fingerboard-top">
                <span class="top-text">充值金额:</span>
                <el-input disabled class="input" v-model="inputValue"></el-input>
            </div>
            <div class="fingerboard-input">
                <div v-for="item in list" :style="clickValue == item.value ? { borderColor: '#318800' } : {}"
                    @click="fingerboardHandle(item)">
                    <span v-if="item.type != 'del'">{{ item.label }}</span>
                    <img v-else class="icon-del" src="../../assets/images/del.png">
                </div>
            </div>
        </div>
    </div>
    <div class="button_parent">
        <ubutton @handler="goback()" :text="'返回'" :model="1"></ubutton>
        <ubutton @handler="confirm()" :text="'去充值'" :model="2"></ubutton>
    </div>
</template>

<script setup lang="ts">
import {
    defineComponent,
    reactive,
    ref,
    toRefs,
    unref,
    watch,
    watchEffect,
} from "vue";
import { useMainStore } from "@/stores/index"
import ubutton from "@/components/button.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const type = route.params.type

const system = useMainStore()
if (type == "water") {
    system.viewName = "水费充值"
} else if (type == "electricity") {
    system.viewName = "电费充值"
}


// let userName = ref<String>("李四")
// let cardNumber = ref<String>("1000001")
// let waterSurplus = ref<Number>(52)
const clickValue = ref<any>(null)
const list = [
    { label: 1, value: 1, type: 'number' },
    { label: 2, value: 2, type: 'number' },
    { label: 3, value: 3, type: 'number' },
    { label: 4, value: 4, type: 'number' },
    { label: 5, value: 5, type: 'number' },
    { label: 6, value: 6, type: 'number' },
    { label: 7, value: 7, type: 'number' },
    { label: 8, value: 8, type: 'number' },
    { label: 9, value: 9, type: 'number' },
    { label: 'dev', value: 'del', type: 'del' },
    { label: 0, value: 0, type: 'number' },
    { label: '确认', value: 'confirm', type: 'confirm' },
]

const inputValue = ref<any>("")
function goback() {
    router.go(-1)
}
// 确认充值，跳转到支付页面
function confirm() {
    const state: any = true
    router.push({ name: "pay", params: { type: type, state: state,amount:inputValue.value } })
}

function fingerboardHandle(event: any) {
    clickValue.value = event.value
    setTimeout(() => { clickValue.value = null }, 300)
    if (event.type == "del") {
        if (inputValue.value != "") {
            let list = inputValue.value.split("")
            list.pop()
            inputValue.value = list.join("")
        }
    } else if (event.type == "confirm") {

    } else {
        if (inputValue.value == "" && event.value == 0) {
            return
        }
        let list = inputValue.value.split("")
        list.push(event.value)
        inputValue.value = list.join("")
    }
}
</script>
<style>
.el-input.is-disabled .el-input__inner {
    color: none !important;

}

.el-input.is-disabled .el-input__wrapper {
    background-color: none !important;
}
</style>

<style lang="less" scoped>
.top {
    // margin-top: 200px;
    // margin-left: 150px;
    display: flex;
    justify-content: center;

    & .top-left {
        width: 540px;
        height: 734px;
        background: linear-gradient(180deg, #FFFFFF 0%, #14BE3C 100%);
        // box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.08);
        // border-radius: 20px 20px 20px 20px;
        opacity: 1;
        position: relative;
        background-size: cover;
        background-image: url(../../assets/images/sf-czbgi@2x.png);

        // & img{
        //     width: 100%;
        //     height: auto;
        // }
        &>div {
            margin-left: 60px;
            margin-top: 67px;
        }
    }
}

.fingerboard {
    margin-left: 40px;
    position: relative;
    width: 850px;
    height: 734px;
    background: #FFFFFF;
    box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.08);
    border-radius: 20px 20px 20px 20px;
    opacity: 1;

    & .fingerboard-top {
        display: flex;
        align-items: center;
        margin-top: 60px;
        margin-left: 60px;

        .input {
            width: 540px;
            height: 90px;
            background: #FFFFFF;
            border-radius: 10px 10px 10px 10px;
            opacity: 1;
            border: 1px solid #C7C7C7;
            color: #333333;
            font-size: 32px;
        }

        .top-text {
            // width: 160px;
            // height: 32px;
            margin-right: 30px;
            font-size: 32px;
            font-family: Source Han Sans CN-Bold, Source Han Sans CN;
            font-weight: bold;
            color: #333333;
            line-height: 0px;
            // -webkit-background-clip: text;
            // -webkit-text-fill-color: transparent;
        }
    }


}

.fingerboard-input {
    margin-left: 90px;
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;

    &>div {
        cursor: pointer;
        margin-bottom: 20px;
        margin-right: 20px;
        text-align: center;
        font-size: 40px;
        line-height: 100px;
        width: 210px;
        font-family: Source Han Sans CN-Regular, Source Han Sans CN;
        font-weight: 400;
        color: #333333;
        height: 40px;
        height: 100px;
        background: #FFFFFF;
        border-radius: 10px 10px 10px 10px;
        opacity: 1;
        border: 2px solid #C7C7C7;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon-del {
            width: 80px;
            height: auto;
        }
    }
}


.left-text {
    //     width: 292px;
    // height: 154px;
    font-size: 34px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #333333;
    // line-height: 60px;
    // -webkit-background-clip: text;

    // -webkit-text-fill-color: transparent;
    & span:nth-child(1) {
        text-align: right;
        display: inline-block;
        width: 150px;
        margin-right: 10px;
    }
}

.text {
    text-align: right;
    // line-height: 100%;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #333333;
    line-height: 0px;
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
}
</style>