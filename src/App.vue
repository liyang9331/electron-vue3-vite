<template>
  <!-- <layout-top @clickHandler="clickHandler()"></layout-top> -->
  <div class="app_page">
    <div class="app_content">
      <router-view></router-view>
    </div>
  </div>
  <elcMessage v-if="system.message.visible"></elcMessage>
  <loading v-if="system.card.isCardReading" title="读卡中..." message="正在读卡中，请勿取出卡片......"></loading>
</template>
<script setup lang="ts">
import layoutTop from "@/components/layout-top.vue";
import { useMainStore } from "@/stores/index";
import { useRouter } from "vue-router";
import { receiveMessage, Socket } from "@/utils/websocket";
import elcMessage from "@/components/message.vue";
import loading from "@/components/loading.vue";
const system = useMainStore();
console.log(window)

// 创建websocket连接,挂载到 window 对象下
connect()
function connect() {
  window.socket = new Socket({
    onmessage: (res: any) => {
      const data = receiveMessage(res);
      //  todo....
    },
    onopen: (res: any) => {
      window.socket.onclose = (res: any) => {
        // 断线重连
        console.log('断线重连')
        connect();
      }
    },
    socketUrl: import.meta.env.VITE_SOCKET_URL,
  }).websocket;
}

const router = useRouter();

function clickHandler() {
  // 返回主页
  router.push({ name: "home" });
}
</script>


<style lang="less" scoped>
.app_page {
  height: calc(100% - 116px);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}
</style>
<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
}

@font-face {
  font-family: "Source Han Sans CN-Medium";
  src: url("./assets/fonts/SourceHanSansSC-Medium.otf");
}

@font-face {
  font-family: "Source Han Sans CN";
  src: url("./assets/fonts/SourceHanSansSC-Normal.otf");
}

#app {
  width: 100%;
  height: 100%;
  background-image: url("./assets/images/app_bgi@2x.png");
  background-size: cover;
}

body {
  margin: 0;
}

.button_parent {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}
</style>
