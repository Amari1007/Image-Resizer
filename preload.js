const { channel } = require('diagnostics_channel');
const {contextBridge, ipcRenderer} = require('electron');
const os = require("os");
const path = require("path");
const { send } = require('process');
const Toastify = require("toastify-js");

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    homeDir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('Toastify', {
    toast: (options) => Toastify(options).showToast(),
});

contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld("path", {
    join: (...args) => path.join(...args),
});

contextBridge.exposeInMainWorld("os", {
    os: os,
});
