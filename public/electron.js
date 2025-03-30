import { app, BrowserWindow, ipcMain, shell, powerSaveBlocker } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES 모듈에서 __dirname 얻기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 타이머 관련 변수 (하이브리드 접근법)
let timerState = {
    time: 0, // 현재 시간 값 (초)
    isRunning: false,
    startTimestamp: 0, // Date.now() 기준 시작 시간
    targetTime: 0, // 목표 시간 (초)
};
let timerInterval = null;
let powerSaveId = -1;
let saveInterval = null;
const SAVE_INTERVAL = 10000; // 10초마다 상태 저장
const STATE_FILE_PATH = path.join(app.getPath('userData'), 'timer-state.json');

let mainWindow = null;

// 타이머 상태 저장 함수
function saveTimerState() {
    try {
        fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(timerState, null, 2));
        console.log('Timer state saved to disk');
    } catch (error) {
        console.error('Error saving timer state:', error);
    }
}

// 타이머 상태 로드 함수
function loadTimerState() {
    try {
        if (fs.existsSync(STATE_FILE_PATH)) {
            const savedState = JSON.parse(fs.readFileSync(STATE_FILE_PATH, 'utf8'));
            console.log('Loaded saved state:', savedState);

            // 앱이 꺼져있는 동안의 시간 계산 (실행 중이었던 경우)
            if (savedState.isRunning && savedState.startTimestamp > 0) {
                const elapsedSinceClose = Math.floor((Date.now() - savedState.startTimestamp) / 1000);
                savedState.time = savedState.time + elapsedSinceClose;
                savedState.startTimestamp = Date.now();
            }

            timerState = savedState;
            return true;
        }
    } catch (error) {
        console.error('Error loading timer state:', error);
    }
    return false;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        minWidth: 850,
        height: 600,
        minHeight: 600,
        width: 850,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#2e2c29',
        show: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: isDev,
            preload: isDev ? path.join(__dirname, 'preload.js') : path.join(app.getAppPath(), 'dist/preload.js'),
        },
    });

    const splashPath = isDev ? path.join(__dirname, 'build/splash.html') : path.join(app.getAppPath(), 'build/splash.html');
    mainWindow.loadFile(splashPath);

    setTimeout(() => {
        const htmlPath = path.join(app.getAppPath(), 'build/index.html');
        const startURL = isDev ? 'http://localhost:3000' : `file://${htmlPath}`;
        mainWindow.loadURL(startURL);

        // 로드 후 저장된 타이머 상태 전송
        setTimeout(() => {
            if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
                mainWindow.webContents.send('timer:update', timerState.time);

                // 타이머가 실행 중이었다면 다시 시작
                if (timerState.isRunning) {
                    startTimer();
                }
            }
        }, 1000);
    }, 2000);

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

// 하이브리드 접근법을 사용한 타이머 시작 함수
function startTimer() {
    console.log('Main process: startTimer called, current time:', timerState.time);

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // 타이머가 실행 중이 아닐 때만 시작 시간 설정
    if (!timerState.isRunning) {
        timerState.startTimestamp = Date.now() - timerState.time * 1000;
        timerState.isRunning = true;

        // 타이머 실행 시에만 절전 모드 차단 (최적화된 절전 관리)
        if (powerSaveId === -1) {
            powerSaveId = powerSaveBlocker.start('prevent-app-suspension');
            console.log('PowerSaveBlocker started with ID:', powerSaveId);
        }

        // 주기적 상태 저장 시작
        if (!saveInterval) {
            saveInterval = setInterval(saveTimerState, SAVE_INTERVAL);
        }

        saveTimerState(); // 타이머 시작 시 상태 즉시 저장
    }

    // Date.now()를 사용한 정확한 경과 시간 계산 + setInterval 조합
    timerInterval = setInterval(() => {
        try {
            // Date.now()로 정확한 경과 시간 계산
            const elapsedMs = Date.now() - timerState.startTimestamp;
            const elapsedSeconds = Math.floor(elapsedMs / 1000);

            // 현재 시간 업데이트
            timerState.time = elapsedSeconds;

            if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
                mainWindow.webContents.send('timer:update', timerState.time);

                // 로깅은 디버깅용으로 간헐적으로만
                if (elapsedSeconds % 30 === 0) {
                    console.log('Timer update:', elapsedSeconds, 'seconds');
                }
            }

            // 1분마다 타이머 상태 저장
            if (elapsedSeconds % 60 === 0) {
                saveTimerState();
            }
        } catch (error) {
            console.error('Error updating timer:', error);
        }
    }, 100); // 100ms 간격으로 업데이트하여 UI 부드럽게

    console.log('Timer started');
}

// 타이머 정지 함수
function stopTimer() {
    console.log('Main process: stopTimer called, current time:', timerState.time);

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    if (timerState.isRunning) {
        timerState.isRunning = false;

        // 정확한 시간 계산을 위해 마지막으로 한번 더 업데이트
        const elapsedMs = Date.now() - timerState.startTimestamp;
        timerState.time = Math.floor(elapsedMs / 1000);

        if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('timer:update', timerState.time);
        }

        // 타이머가 멈추면 절전 모드 차단 해제 (최적화된 절전 관리)
        if (powerSaveId !== -1) {
            powerSaveBlocker.stop(powerSaveId);
            powerSaveId = -1;
            console.log('PowerSaveBlocker stopped');
        }

        // 상태 저장
        saveTimerState();

        console.log('Timer stopped at:', timerState.time, 'seconds');
    }
}

// 타이머 재설정 함수
function resetTimer() {
    console.log('Main process: resetTimer called');

    stopTimer(); // 먼저 타이머 중지

    timerState.time = 0;
    timerState.startTimestamp = 0;

    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
        mainWindow.webContents.send('timer:update', 0);
    }

    // 상태 저장
    saveTimerState();

    console.log('Timer reset');
}

// 타이머 시간 설정 함수
function setTimerValue(newTime) {
    console.log('Main process: setTimerValue called with time:', newTime);

    stopTimer(); // 먼저 타이머 중지

    timerState.time = newTime;

    if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
        mainWindow.webContents.send('timer:update', timerState.time);
    }

    // 상태 저장
    saveTimerState();

    console.log('Timer set to:', timerState.time, 'seconds');
}

// 앱 준비되면 실행
app.whenReady().then(() => {
    // 저장된 타이머 상태 로드
    loadTimerState();

    createWindow();

    // 기존 IPC 핸들러 등록
    ipcMain.handle('open-external', async (event, url) => {
        console.log('Main process opening:', url);
        return shell.openExternal(url);
    });

    // 타이머 관련 IPC 이벤트 핸들러 등록
    ipcMain.on('timer:start', () => {
        console.log('IPC: timer:start received');
        startTimer();
    });

    ipcMain.on('timer:stop', () => {
        console.log('IPC: timer:stop received');
        stopTimer();
    });

    ipcMain.on('timer:reset', () => {
        console.log('IPC: timer:reset received');
        resetTimer();
    });

    ipcMain.on('timer:set', (_, newTime) => {
        console.log('IPC: timer:set received with time:', newTime);
        setTimerValue(newTime);
    });

    // 타이머 상태 요청 핸들러
    ipcMain.on('timer:request-state', () => {
        console.log('IPC: timer:request-state received');
        if (mainWindow && !mainWindow.isDestroyed() && !mainWindow.webContents.isDestroyed()) {
            mainWindow.webContents.send('timer:update', timerState.time);
            mainWindow.webContents.send('timer:running-state', timerState.isRunning);
        }
    });

    console.log('Timer IPC handlers registered');
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// 앱 종료 시 타이머 정리 및 상태 저장
app.on('before-quit', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    if (saveInterval) {
        clearInterval(saveInterval);
    }

    if (powerSaveId !== -1) {
        powerSaveBlocker.stop(powerSaveId);
        console.log('PowerSaveBlocker stopped on app quit');
    }

    // 앱 종료 전 마지막 상태 저장
    saveTimerState();
});
