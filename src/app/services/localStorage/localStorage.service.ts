import { Injectable } from '@angular/core';
import { LocalStorageEngine } from '../interfaces/localStorage.service.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements LocalStorageEngine {
  isLocalStorageAvailable(): boolean {
    return typeof localStorage !== 'undefined';
  }

  getCachedData(key: string): any | null {
    if (this.isLocalStorageAvailable()) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  setCachedData(key: string, data: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }

  clearCache(): void {
    if (this.isLocalStorageAvailable()) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('page')) {
          localStorage.removeItem(key);
        }
      });
    }
  }
}
