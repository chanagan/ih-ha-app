const { ipcRenderer, contextBridge } = require('electron')

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