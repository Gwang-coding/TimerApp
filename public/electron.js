import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname 얻기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 850,
        height: 600,
        minHeight: 600,
        width: 850,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#2e2c29', // 배경색 설정 (초기 로딩 중 표시)
        show: true, // 창을 바로 표시 (비어있는 상태로)
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true,
            preload: isDev ? path.join(__dirname, 'preload.js') : path.join(app.getAppPath(), 'dist/preload.js'),
        },
    });
    // splash.html도 조건부 경로 처리
    const splashPath = isDev ? path.join(__dirname, 'build/splash.html') : path.join(app.getAppPath(), 'build/splash.html');

    mainWindow.loadFile(splashPath);

    setTimeout(() => {
        const htmlPath = path.join(app.getAppPath(), 'build/index.html');
        const startURL = isDev ? 'http://localhost:3000' : `file://${htmlPath}`;

        mainWindow.loadURL(startURL);
    }, 2000);

    // 개발 모드에서만 개발자 도구 열기
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.setResizable(false);
    mainWindow.on('closed', function () {
        mainWindow = null;
        app.quit();
    });
    mainWindow.focus();
}

// 앱 준비되면 실행
app.whenReady().then(() => {
    createWindow();

    // IPC 핸들러 등록
    ipcMain.handle('open-external', async (event, url) => {
        console.log('Main process opening:', url);
        return shell.openExternal(url);
    });
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
