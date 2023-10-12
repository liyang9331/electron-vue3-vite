import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {

    path: "/",
    redirect: '/home'
  },
  {
    // 首页
    path: "/home",
    name: "home",
    component: () => import("../views/home/index.vue"),
  }
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
