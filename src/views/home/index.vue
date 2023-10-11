<template>
    <div>
        <a href="https://www.electronjs.org/" target="_blank">
            <img src="@/assets/images/icon/electron-logo.svg" class="logo electron" alt="Electron logo" />
        </a>
        <a href="https://vitejs.dev/" target="_blank">
            <img src="@/assets/images/icon/vite-logo.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="@/assets/images/icon/vue-logo.svg" class="logo vue" alt="Vue logo" />
        </a>
        <a href="https://element-plus.gitee.io/zh-CN/component/button.html" target="_blank">
            <img src="@/assets/images/icon/element-plus-logo.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <HelloWorld msg="Electron + Vite + Vue + Element-Plus" />
    <!--  -->
    <!-- <el-button class="elbutton" @click="navgiteto('/home')">page-home</el-button> -->
    <el-button class="elbutton" @click="openWeb">在新窗口中打开百度</el-button>
    <el-button class="elbutton" @click="openFile">打开文件</el-button>
    文件路径：{{ filePath }}
    <div class="flex-center">
        Place static files into the <code>/public</code> folder
        <img style="width:5em;" src="@/assets/images/icon/node-logo.svg" alt="Node logo">
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
    onMounted, onUpdated, onUnmounted
} from "vue";
import tips from "@/components/tips.vue"
import { useMainStore } from "@/stores/index"
import { useRoute, useRouter } from "vue-router";
import { receiveMessage } from '@/utils/websocket'
import { rubbish } from "@/api/index"
const system = useMainStore()
system.viewName = "自助服务终端"

// 设置基本数据类型时，使用 ref
const filePath = ref<string>("")
function navgiteto(key: string) {
    router.push(key)
}
// 在新窗口打开网页
function openWeb() {
    window.electronAPI.openWeb("https://www.baidu.com")
}
// 选择文件，获取文件路径
async function openFile() {
    filePath.value = await window.electronAPI.openFile()
}

// rubbish({ name: "香蕉" }).then((res: any) => {
//     console.log(res)
// })
const route = useRoute();
const router = useRouter();
// console.log("00000")
interface Nav {
    key: string;
    path: string;
    displayName: string;
}
const navs: Nav[] = [
    {
        key: "/elem-tmpl",
        path: "/elem-tmpl",
        displayName: "elem-tmpl"
    },
];
</script>

<style lang="less" scoped>
.page_title {
    width: auto;
    height: auto;
}

.elbutton {
    padding: 20px;
    font-size: 35px;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo.electron:hover {
    filter: drop-shadow(0 0 2em #9FEAF9);
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}

.center {
    margin-top: 40px;
    display: flex;
    width: 1430px;
    justify-content: space-between;

    .card {
        width: 335px;
        height: 500px;
        // height: 100px;
        // background-color: yellow;
        position: relative;
        cursor: pointer;

        & .card-body {
            // position: relative;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99;
            width: 100%;
            min-height: 100%;
            flex-direction: column;

            & .card-text {
                text-align: center;
                //             width: 192px;
                // height: 48px;
                font-size: 2rem;
                font-family: Source Han Sans CN-Bold, Source Han Sans CN;
                font-weight: bold;
                color: #FFFFFF;
                line-height: 0px;
                text-shadow: 0px 3px 14px rgba(0, 0, 0, 0.16);
                -webkit-background-clip: text;
                // -webkit-text-fill-color: transparent;
            }

            & .card-icon {
                width: 20px;
                height: 20px;
            }
        }
    }
}

// .tips {
//     margin-left: 245px;
//     width: 1430px;
// }

.title {
    //     width: 780px;
    // height: 52px;
    text-align: center;
    font-size: 52px;
    font-family: Source Han Sans CN-Bold, Source Han Sans CN;
    font-weight: bold;
    color: #333333;
    // line-height: 0px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
}

.cztips {
    //     width: 286px;
    // height: 22px;
    font-size: 22px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    line-height: 0px;
    -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
}
</style>
  