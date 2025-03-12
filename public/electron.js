import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';

// ES 모듈에서 __dirname 얻기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

async function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 850,
        height: 600,
        minHeight: 600,
        width: 900,
        titleBarStyle: 'hiddenInset',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
        },
    });

    // 확인된 경로로 바로 설정
    const htmlPath = path.join(__dirname, './build/index.html');
    const startURL = isDev ? 'http://localhost:3000' : `file://${htmlPath}`;

    try {
        // 실제 앱 로드
        await mainWindow.loadURL(startURL);
    } catch (err) {
        console.error('Failed to load URL:', err);
        // 오류 메시지를 표시하는 간단한 HTML 로드
        await mainWindow.loadURL(`data:text/html,<html><body><h1>Error Loading App</h1><p>${err.message}</p></body></html>`);
    }

    // 개발 모드에서만 개발자 도구 열기
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.setResizable(true);
    mainWindow.on('closed', function () {
        mainWindow = null;
        app.quit();
    });
    mainWindow.focus();
}

// 앱 준비되면 실행
app.whenReady().then(() => {
    createWindow();

    // 전역 단축키 등록
    try {
        globalShortcut.register('CommandOrControl+Shift+I', () => {
            if (mainWindow) {
                mainWindow.webContents.openDevTools({ mode: 'detach' });
            }
        });
    } catch (err) {
        console.error('Failed to register shortcut:', err);
    }
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
