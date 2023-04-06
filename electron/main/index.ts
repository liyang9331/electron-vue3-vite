/**
 * electron 主进程
 * 主进程在 Node.js 环境中运行，这意味着它具有 require 模块和使用所有 Node.js API 的能力。
 */

import { app, BrowserWindow, shell, ipcMain, Notification,dialog,session } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'

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

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (canceled) {
    return
  } else {
    return filePaths[0]
  }
}

function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    width: 1500,
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    autoHideMenuBar:true,//隐藏菜单
    webPreferences: {
      //预加载脚本可以在 BrowserWindow 构造方法中的 webPreferences 选项里被附加到主进程。
      preload,
      webSecurity:false,//关闭web权限检查，允许跨域
      // Read more on https://www.electronjs.org/zh/blog/electron-4-0#webpreferences-default-values
      nodeIntegration: false,//预加载脚本的渲染器是否启用沙盒-默认启用
      contextIsolation: true,//是否开启上下文隔离-默认开启
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  /**
   * IPC：渲染器进程到主进程（单向）
   */
  ipcMain.on('open-web', (event, url) => {
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
    ipcMain.handle('dialog:openFile',handleFileOpen)
}

app.whenReady().then(createWindow)

app.on('ready',()=>{
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
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
