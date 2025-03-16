const { app, BrowserWindow, Menu } = require('electron')
// const steamworks = require('steamworks.js')

function createWindow() {
    Menu.setApplicationMenu(null);

    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    // will be true when opened from steam big picture
    if (process.env.SteamTenfoot) {
        mainWindow.setFullScreen(true)
    } else {
        mainWindow.maximize()
    }
    
    // mainWindow.webContents.openDevTools()
    mainWindow.loadFile('examples/random/main_menu.html')
}
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// steamworks.electronEnableSteamOverlay()