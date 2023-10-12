/**
 * 在上下文隔离启用的情况下使用预加载
 * 从 Electron 20 开始，预加载脚本默认 沙盒化 ，不再拥有完整 Node.js 环境的访问权。 实际上，这意味着你只拥有一个 polyfilled 的 require 函数，这个函数只能访问一组有限的 API。
 * 预加载脚本与浏览器共享同一个全局 Window 接口，并且可以访问 Node.js API，所以它通过在全局 window 中暴露任意 API 来增强渲染器，以便你的网页内容使用。
 * contextBridge 模块可以用来安全地从独立运行、上下文隔离的预加载脚本中暴露 API 给正在运行的渲染进程
 */

// @ts-nocheck
const { contextBridge, ipcRenderer } = require('electron')
// const {app} = require('electron')
// window.app = app
contextBridge.exposeInMainWorld('electronAPI', {
  // IPC：渲染器进程到主进程（单向）
  openWeb: (url) => ipcRenderer.send('open-web', url),
  exit: () => ipcRenderer.send('exit'),
  // IPC：渲染器进程到主进程（双向）
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
})

const path = require('path');
// console.log(path)
var dataFile = ''
if (process.env.WEBPACK_DEV_SERVER_URL) {
  dataFile = '../'
} else {
  dataFile = '../../'
}
const appPath = __dirname
const rootPath = path.join(appPath, dataFile)
const dbPath = path.join(rootPath, '/data/db.db')

// 集成db模块
const sq3 = require('sqlite3');
const sqlite3 = sq3.verbose();
var db = new sqlite3.Database(dbPath);

const select = (sql) => {
  return new Promise((resolve, reject) => {
    db.all(sql, function (err, res) {
      if (!err) {
        resolve(res)
      } else {
        reject(err)
      }
    })
  }, (reason) => {
    reason(false)
  })
}
var config = []
select('select * from config').then(res => {
  db.close()
  // var sysConfig = {}
  if (res && res.length > 0) {
    config = res
    // for (var i in res) {
    //   sysConfig[res[i]['name']] = res[i]['value']
    // }
  }
  // windows 全局对象
  global.config = function (confName) {
    for (var i in config) {
      if (config[i].name === confName) {
        return config[i]
      }
    }
  }
})
process.once('loaded', () => {
  global.appPath = appPath
  global.rootPath = rootPath
  global.dbPath = dbPath
})