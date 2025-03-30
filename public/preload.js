const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script starting...');

try {
    // IPC를 통해 main 프로세스에 요청하는 방식 사용
    contextBridge.exposeInMainWorld('Electron', {
        openExternal: (url) => {
            console.log('Requesting main process to open:', url);
            return ipcRenderer.invoke('open-external', url);
        },
    });

    // 개선된 타이머 API 노출
    contextBridge.exposeInMainWorld('timerAPI', {
        // 기본 타이머 제어 기능
        startTimer: () => {
            console.log('Renderer: sending timer:start');
            ipcRenderer.send('timer:start');
        },
        stopTimer: () => {
            console.log('Renderer: sending timer:stop');
            ipcRenderer.send('timer:stop');
        },
        resetTimer: () => {
            console.log('Renderer: sending timer:reset');
            ipcRenderer.send('timer:reset');
        },
        setTime: (time) => {
            console.log('Renderer: sending timer:set with time:', time);
            ipcRenderer.send('timer:set', time);
        },

        // 상태 요청 함수 추가
        requestTimerState: () => {
            console.log('Renderer: requesting timer state');
            ipcRenderer.send('timer:request-state');
        },

        // 타이머 시간 업데이트 리스너
        onTimeUpdate: (callback) => {
            console.log('Renderer: registering timer:update listener');

            const listener = (_event, time) => {
                console.log('Renderer: received timer:update with time:', time);
                callback(time);
            };

            ipcRenderer.on('timer:update', listener);

            // 리스너 제거 함수 반환
            return () => {
                console.log('Renderer: removing timer:update listener');
                ipcRenderer.removeListener('timer:update', listener);
            };
        },

        // 타이머 실행 상태 리스너 추가
        onRunningStateChange: (callback) => {
            console.log('Renderer: registering timer:running-state listener');

            const listener = (_event, isRunning) => {
                console.log('Renderer: received timer:running-state:', isRunning);
                callback(isRunning);
            };

            ipcRenderer.on('timer:running-state', listener);

            // 리스너 제거 함수 반환
            return () => {
                console.log('Renderer: removing timer:running-state listener');
                ipcRenderer.removeListener('timer:running-state', listener);
            };
        },
    });

    console.log('Preload script: Electron and Timer APIs exposed successfully');
} catch (error) {
    console.error('Preload script error:', error);
}
