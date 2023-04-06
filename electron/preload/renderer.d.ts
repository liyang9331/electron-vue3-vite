export interface IElectronAPI{
    openWeb:(url:string)=>Promise<void>,
    openFile:()=>Promise<string>,
    desktop:string
}

declare global{
    interface Window {
        electronAPI:IElectronAPI
    }
}