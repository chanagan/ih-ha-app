const { ipcRenderer, contextBridge } = require('electron')
// const settings = require('electron-settings');
// const appData = getPath("userData");

// console.log('preload: appData: ', appData)
// console.log('preload: settings: ', settings)

const WINDOW_API = {
    getVersion: () => ipcRenderer.invoke('get/version'),
    getDashboard: () => ipcRenderer.invoke('get/dashboard'),
    send: (channel, data) => {
        ipcRenderer.send(channel, data)
    }
}

contextBridge.exposeInMainWorld('api', WINDOW_API)

ipcRenderer.on('haList', (event, haAcctRecordsList) => {
    window.postMessage({ type: 'haList', haAcctRecordsList }, '*')
})

ipcRenderer.on('haDetails', (event, haDetails) => {
    window.postMessage({ type: 'haDetails', haDetails }, '*')
})  