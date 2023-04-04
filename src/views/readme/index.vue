<script setup lang="ts">
import HelloWorld from '../../components/HelloWorld.vue'
import { useRouter } from "vue-router";
const router = useRouter()
function navgiteto(key:string){
  router.push(key)
}
function openWeb(){
    window.electronAPI.openWeb("https://www.baidu.com")
}
</script>

<template>
  <div>
    <a href="https://www.electronjs.org/" target="_blank">
      <img src="@/assets/electron.svg" class="logo electron" alt="Electron logo" />
    </a>
    <a href="https://vitejs.dev/" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="@/assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Electron + Vite + Vue" />
  <!--  -->
  <el-button @click="navgiteto('/home')">page-home</el-button>
  <el-button @click="openWeb">在新窗口中打开百度</el-button>
  <div class="flex-center">
    Place static files into the <code>/public</code> folder
    <img style="width:5em;" src="/node.svg" alt="Node logo">
  </div>
</template>

<style>
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
</style>
