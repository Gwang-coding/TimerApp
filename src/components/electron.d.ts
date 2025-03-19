interface ElectronAPI {
    openExternal: (url: string) => Promise<void>;
}

declare global {
    interface Window {
        Electron: ElectronAPI;
    }
}

export {};
