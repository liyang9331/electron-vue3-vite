# 跨平台桌面客户端开发

技术栈： `Electron【桌面开发框架】` + `TypeScript` + `Vue3` + `Vite【vue3开发构建工具】` + `Element-Plus【element-ui 适配vue3版本】--集成开发环境`

## 初始化

```sh
yarn or npm install
```

## 目录结构

```diff
+ ├─┬ electron
+ │ ├─┬ main
+ │ │ └── index.ts    entry of Electron-Main
+ │ └─┬ preload
+ │   └── index.ts    entry of Preload-Scripts
  ├─┬ src
  │ └── main.ts       entry of Electron-Renderer
  │     ...
  ├── index.html
  ├── package.json
  └── vite.config.ts
```