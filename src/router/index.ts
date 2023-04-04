import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../views/readme/index.vue"),
  },
  {
    path: "/elem-tmpl",
    component: () => import("../views/elem/define-tmpl.vue"),
  },
  {
    path: "/home",
    component: () => import("../views/home/index.vue"),
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
