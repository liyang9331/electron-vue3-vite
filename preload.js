/**
 * 什么是预加载脚本？
Electron 的主进程是一个拥有着完全操作系统访问权限的 Node.js 环境。 除了 Electron 模组 之外，你也可以使用 Node.js 内置模块 和所有通过 npm 安装的软件包。 另一方面，出于安全原因，渲染进程默认跑在网页页面上，而并非 Node.js里。

为了将 Electron 的不同类型的进程桥接在一起，我们需要使用被称为 预加载 的特殊脚本。

使用预加载脚本来增强渲染器
BrowserWindow 的预加载脚本运行在具有 HTML DOM 和 Node.js、Electron API 的有限子集访问权限的环境中。
预加载脚本像 Chrome 扩展的 内容脚本（Content Script）一样，会在渲染器的网页加载之前注入。 如果你想向渲染器加入需要特殊权限的功能，你可以通过 contextBridge 接口定义 全局对象。
 */

/**
 * 为了演示这一概念，你将会创建一个将应用中的 Chrome、Node、Electron 版本号暴露至渲染器的预加载脚本
 * 新建一个 preload.js 文件。该脚本通过 versions 这一全局变量，将 Electron 的 process.versions 对象暴露给渲染器。
 */
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
    // 能暴露的不仅仅是函数，我们还可以暴露变量
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    //在预处理脚本中设置 invoke 调用
    ping: () => ipcRenderer.invoke('ping'),
    // 获取主题颜色,使用 IPC 通道提供主题切换和重置控制
    toggle:()=>ipcRenderer.invoke('dark-mode:toggle'),
    system:()=>ipcRenderer.invoke('dark-mode:system'),
})
