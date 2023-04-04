const {contextBridge,ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI',{
  openWeb:(url)=> ipcRenderer.send('open-web',url)
})