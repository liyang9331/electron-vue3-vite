"use strict";
var electron = require("electron");
var path = require("path");
function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { "default": e };
}
var path__default = /* @__PURE__ */ _interopDefaultLegacy(path);
const createWindow = () => {
  const win = new electron.BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path__default["default"].join(__dirname, "../electron/preload/index.js")
    }
  });
  if (electron.app.isPackaged) {
    win.loadFile(path__default["default"].join(__dirname, "../index.html"));
  } else {
    const url = "http://localhost:3000";
    win.loadURL(url);
  }
};
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
//# sourceMappingURL=index.js.map
