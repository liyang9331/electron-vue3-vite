<template>
    <el-menu :default-active="selectedKeys" class="el-menu-demo" mode="horizontal" background-color="#545c64"
        text-color="#fff" active-text-color="#ffd04b" @select="choose">
        <el-menu-item :index="nav.key" :key="nav.key" v-for="nav in navs"> {{ nav.displayName }}</el-menu-item>
    </el-menu>
    <router-view />
</template>
  
<script setup lang="ts">
import { pa } from "element-plus/es/locale";
import {
    defineComponent,
    reactive,
    ref,
    toRefs,
    unref,
    watch,
    watchEffect,
} from "vue";

import { useRouter } from "vue-router";

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
        displayName: "elem-tmpl",
    },
];
const router = useRouter();
let selectedKeys: Array<string> = []

//等路由变了之后激活
watchEffect(() => {
    selectedKeys = [router.currentRoute.value.path];
});

const choose = (key:string): void => {
    // console.log(key)
    // selectedKeys = [indexPath];
    router.push(key);
};
</script>
  