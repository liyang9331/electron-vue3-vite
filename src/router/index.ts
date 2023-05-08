import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {

    path: "/",
    redirect: '/home'
  },
  {
    // 首页
    path: "/home",
    name:"home",
    component: () => import("../views/home/index.vue"),
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
