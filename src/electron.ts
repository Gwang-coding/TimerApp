import { app, BrowserWindow, ipcMain, shell } from 'electron';
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
            nodeIntegration: false,
            contextIsolation: true,
            devTools: !!isDev,
            sandbox: true, // 샌드박스 모드 활성화
            preload: path.join(__dirname, 'preload.js'),
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

app.on('ready', () => {
    createWindow();

    // IPC 핸들러 등록
    ipcMain.handle('open-external', async (event, url: string) => {
        console.log('Main process opening:', url);
        return shell.openExternal(url);
    });
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
