const { app, BrowserWindow, ipcMain } = require('electron');
const { join } = require('path');

const isDev = !app.isPackaged;

const appData = app.getPath("userData");
console.log("main: appData: ", appData);
let configFile = join(appData, "ih-ap-config.json");
const cbConfig = require(configFile);

const { getHA, getHADetails, postAcctCharge, postCCService } = require('./js/haMainFuncs.cjs');

// const { get } = require('http');

let win;

app.whenReady().then(main);

function main() {

    win = new BrowserWindow({
        width: cbConfig.winWidth,
        height: cbConfig.winHeight,
        x: cbConfig.winX,
        y: cbConfig.winY,
        autoHideMenuBar: true,
        webPreferences: {
            preload: join(__dirname, './preload.js'),
        },
    });

    win.loadFile(join(__dirname, '../public/index.html'));
    win.on('ready-to-show', win.show);

    console.log("main: isDev: ", isDev);
    if (isDev) win.webContents.openDevTools({mode: 'detach'});  
}

ipcMain.handle('get/version', () => app.getVersion());

ipcMain.on('get/haDetails', async (event, accountID) => {
    // console.log('main: get/haDetails', accountID);
    console.log(`main: get/haDetails: ${accountID} `);
    getHADetails(win, accountID);
});

ipcMain.on('get/ha', async (event) => {
    console.log('main: get/ha');
    getHA(win);
});

ipcMain.on('postAcctCharge', async (event, adjData) => {
    console.log('main: postAcctCharge: ', adjData);
    postAcctCharge(win, adjData);
    // getHA(win);
});

ipcMain.on('postCCService', async (event, adjData) => {
    console.log('main: postCCService: ', adjData);
    postCCService(win, adjData);
    // getHA(win);
});

