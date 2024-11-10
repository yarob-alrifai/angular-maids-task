import { InjectionToken } from '@angular/core';


export const LOCAL_STORAGE_ENGINE = new InjectionToken<LocalStorageEngine>('LOCAL_STORAGE_ENGINE');

export interface LocalStorageEngine {

   isLocalStorageAvailable(): boolean ;
   getCachedData(key: string): any | null ;
   setCachedData(key: string, data: any): void ;
   clearCache(): void ;

}



