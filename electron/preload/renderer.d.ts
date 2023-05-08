export interface IElectronAPI{
    openWeb:(url:string)=>Promise<void>,
    exit:()=>Promise<void>,
    openFile:()=>Promise<string>,
    desktop:string
}

declare global{
    interface Window {
        electronAPI:IElectronAPI
    }
}