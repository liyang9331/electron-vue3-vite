/**
 * electron 主进程
 * 主进程在 Node.js 环境中运行，这意味着它具有 require 模块和使用所有 Node.js API 的能力。
 */

import { app, BrowserWindow, shell, ipcMain, Notification, dialog, session,nativeImage,crashReporter } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import * as ellog from "electron-log"
const path = require('path')

const log:any = ellog
// 50M
log.transports.file.maxSize = 50 * 1024 * 1024;

/**
 * 日志目录存储
 * mac： ~/Library/Application Support
 * windows: 搜索栏输入 %appdata%
 * 可使用的标签：
 *   log
      error
      warn
      info
      verbose
      debug
      silly
 */
// setTimeout(() => {
//   process.crash()
// }, 10000);

// ----------- 系统崩溃堆栈文件 start --------------
// 获取奔溃堆栈文件存放路径
let crashFilePath = '';
let crashDumpsDir = '';
try {
  // electron 低版本
  crashFilePath = path.join(app.getPath('temp'), app.getName() + ' Crashes');
  // console.log('crash path:', crashFilePath); 
 
  // electron 高版本
  crashDumpsDir = app.getPath('crashDumps');
  // console.log('crashDumpsDir:', crashDumpsDir);
} catch (e) {
  console.error('获取奔溃文件路径失败', e);
}
// ----------- 系统崩溃堆栈文件 end --------------


// ----------- 客户端日志 start --------------
// global.log= log
// Optional, initialize the logger for any renderer processses
// log.initialize({ preload: true });

// log.info('Log from the main process');
// ----------- 客户端日志 end --------------


// ------- 监听渲染进程和 GPU 进程奔溃事件 start ----------
app.on('render-process-gone', (event, webContents, details) => {
  // console.log('------')
  // console.warn('app:render-process-gone', event, webContents, details);
});
 
app.on('child-process-gone', (event, details) => {
  // console.log('------')
  // console.warn('app:child-process-gone', event, details);
});
// ------- 监听渲染进程和 GPU 进程奔溃事件 end ----------

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win:any = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

function createWindow() {
  const emptyIcon = nativeImage.createEmpty()
  win = new BrowserWindow({
    title: 'Main window',
    show: true,// 收否显示窗口
    // fullscreen:true,
    width: 1280,
    height:1024,
    // icon: join(process.env.PUBLIC, 'favicon.ico'),
    // icon: emptyIcon,// 设置为空字符串
    autoHideMenuBar: false,//置为 true 时，菜单栏会在窗口失去焦点时自动隐藏
    webPreferences: {
      //预加载脚本可以在 BrowserWindow 构造方法中的 webPreferences 选项里被附加到主进程。
      preload,
      webSecurity: false,//关闭web权限检查，允许跨域
      // Read more on https://www.electronjs.org/zh/blog/electron-4-0#webpreferences-default-values
      nodeIntegration: false,//是否允许在渲染进程（即 Web 页面中）访问 Node.js 模块和 API
      contextIsolation: true,//是否开启上下文隔离-开启后在渲染进程中无法直接访问 Node.js 模块和 API
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }
  
  // 解决窗口显示时有视觉闪烁
  win.once('ready-to-show',()=>{
    win.show()
    // setTimeout(()=>{
    //   win.loadFile(indexHtml)
    // },10000)
  })

  //生产环境阻止窗口关闭
  win.on('closed', (event:any) => {
  //  event.preventDefault()
  })

  // 网页未响应
  win.on('unresponsive',(event:any)=>{
    // 重新加载页面
    const url = win.webContents.getURL()
    log.warn(`页面未响应：${url}`)
    // win.reload()
    win.loadFile(indexHtml)
  })

  // 进入开发者模式-显示菜单栏
  // win.menuBarVisible

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler((data:any) => {
    if (data.url.startsWith('https:')) shell.openExternal(data.url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  /**
   * IPC：渲染器进程到主进程（单向）
   */
  ipcMain.on('open-web', (event:any, url:any) => {
    new Notification({ title: "网址", body: url }).show();
    const childWindow = new BrowserWindow({
      webPreferences: {
        preload,
        // nodeIntegration: true,
        // contextIsolation: false,
      },
    })

    childWindow.loadURL(`${url}`)
  })

  /**
 * IPC：渲染器进程到主进程（双向）
 */
  ipcMain.handle('dialog:openFile', handleFileOpen)
}

app.whenReady().then(createWindow)


app.on('ready', () => {
  // const filter = {urls:['*://*/*']}
  // session.defaultSession.webRequest.onBeforeSendHeaders(filter,(details,callback)=>{
  //   details.requestHeaders['Origin']='*'
  //   callback({cancel:false,requestHeaders:details.requestHeaders})
  // })
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
// ipcMain.handle('open-win', (event, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: false,
//       contextIsolation: true,
//     },
//   })

//   if (process.env.VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${url}#${arg}`)
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })

// ipcMain.handle('exit', (event, arg) => {
//   console.log("000000")
//   app.exit()
// })
