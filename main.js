// eslint-disable-next-line no-unused-vars
const { app, nativeTheme, BrowserWindow } = require('electron');

const fs = require("fs");
const path = require("path");

var window;

function init () {
    const bSingleInstanceLock = app.requestSingleInstanceLock();
    if (!bSingleInstanceLock) {
        app.quit();
    }

    var window = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    window.loadFile("index.html");
    window.setMenuBarVisibility(false);
    window.maximize();

    //window.webContents.openDevTools();

    window.once('ready-to-show', () => {
        window.show()
    })

    window.on("closed", () => {
        window = null;
    });
}

app.on('ready', init);

app.on('second-instance', () => {
    window.focus();
});

app.on('activate', () => {
    if (!window) {
        init();
    }
});

nativeTheme.themeSource = 'light';
