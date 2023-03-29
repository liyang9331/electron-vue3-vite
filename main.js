/**
 * main 是所有 Electron 应用的入口点
 * 这个文件控制 主程序 (main process)，它运行在 Node.js 环境里，
 * 负责控制您应用的生命周期、显示原生界面、执行特殊操作并管理渲染器进程 (renderer processes)
 */

/**
 * 我们使用 CommonJS 语法导入了两个 Electron 模块
 * app，它控制您的应用的事件生命周期。
 * BrowserWindow，它负责创建和管理应用的窗口。
 */
const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const path = require('path')

/**
 * 将可复用的函数写入实例化窗口
 * createWindow() 函数将您的页面加载到新的 BrowserWindow 实例中
 */
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        //为了将脚本附在渲染进程上，在 BrowserWindow 构造器中使用 webPreferences.preload 传入脚本的路径。
        webPreferences: {
            /**
             * __dirname 字符串指向当前正在执行脚本的路径 (在本例中，它指向你的项目的根文件
             * path.join API 将多个路径联结在一起，创建一个跨平台的路径字符串。
             */
            preload: path.join(__dirname, 'preload.js')
        }
    })
    ipcMain.handle('ping', () => 'ping')
    win.loadFile('index.html')

    /**
     * Electron 应用程序从nativeTheme中获取主题颜色。此外，它还使用 IPC 通道提供主题切换和重置控制。
     */
    ipcMain.handle('dark-mode:toggle',()=>{
        if(nativeTheme.shouldUseDarkColors){
            nativeTheme.themeSource = 'light'
        }else{
            nativeTheme.themeSource='dark'
        }
        return nativeTheme.shouldUseDarkColors
    })

    ipcMain.handle('dark-mode:system'),()=>{
        nativeTheme.themeSource = 'system'
    }
}

/**
 * 在应用准备就绪时调用函数
 */
app.whenReady().then(() => {
    createWindow()


    /**
     * 如果没有窗口打开则打开一个窗口 (macOS)
     * 与前二者相比，即使没有打开任何窗口，macOS 应用通常也会继续运行。 在没有窗口可用时调用 app 会打开一个新窗口。
     * 为了实现这一特性，可以监听模组的 activate 事件，如果没有任何活动的 BrowserWindow，调用 createWindow() 方法新建一个。
     * 因为窗口无法在 ready 事件前创建，你应当在你的应用初始化后仅监听 activate 事件。 要实现这个，仅监听 whenReady() 回调即可。
     */
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

/**
 * Electron 的很多核心模组是 Node.js 事件触发器，遵守 Node.js 的异步事件驱动架构。 app 模块就是其中一个。
 * 在 Electron 中，只有在 app 模组的 ready 事件能触发后才能创建 BrowserWindows 实例。 
 * 您可以借助 app.whenReady() API 来等待此事件，并在该 API 的 promise 被 resolve 时调用 createWindow() 方法。
 * 
 * 应用中的每个页面都在一个单独的进程中运行，我们称这些进程为 渲染器 (renderer) 。 
 * 渲染器也能访问前端开发常会用到的 API 和工具，例如用于打包并压缩代码的 webpack，还有用于构建用户界面的 React 。
 */


/**
 * 关闭所有窗口时退出应用 (Windows & Linux)
 * 在 Windows 和 Linux 上，我们通常希望在关闭一个应用的所有窗口后让它退出。 
 * 若要在 Electron 中实现这一点，您可以监听 window-all-closed 事件，并调用 app.quit() 来让应用退出。这不适用于 macOS。
 */
app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') app.quit()
})