import { defineStore } from "pinia";
// interface Card{
//   insertCard?:boolean;
//   isCardReading?:boolean;
// }
// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。(比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useMainStore = defineStore("main", {
  // id:'main',//如果definePinia没有传入第一个参数name,而是直接传入一个对象，那么我们可以在这里设置id；是等价的
  // state 是 store 的数据 (data)
  state: () => {
    return {
      viewName: "", //页面名称
      isWebSocket: false,
      //卡片信息
      card: {},
      //全局消息提示
      message: {
        title: "",
        message: "",
        visible: false,
      },
      //数据字典
      dataDictionary: {
        // 交易状态
        payStatus: [{ value: 1, label: "已完成" }, { value: 1, label: "未完成" }],
        // 圈存状态
        entrapStatus: [{ value: 1, label: "已圈存" }, { value: 1, label: "未圈存" }],
        // 支付来源
        paySource: [{ value: 1, label: "app" }, { value: 1, label: "终端机" }],
      }
    }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  // getters 是 store 的计算属性 (computed)
  // actions 则是方法 (methods)
  actions: {
    setCard (data) {
      this.card = Object.assign(this.card, data);
    },
    setMessage (data) {
      this.message.message = data;
      this.message.visible = true;
      // this.message = Object.assign(this.message, data);
    },
  },
});
