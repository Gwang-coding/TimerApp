import { app, BrowserWindow } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;

async function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 850,
        height: 600,
        width: 800,
        titleBarStyle: 'hiddenInset',
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            devTools: !!isDev,
        },
    });

    // ***중요***
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    mainWindow.loadURL(startURL);

    if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });

    mainWindow.setResizable(true);
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });

    mainWindow.focus();
}

app.on('ready', createWindow);

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
