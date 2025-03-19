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
    console.log('Preload script: Electron API exposed successfully');
} catch (error) {
    console.error('Preload script error:', error);
}
