import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public setData(key: string, value: any) {
    console.log('StorageService.setData', key, value);

    localStorage.setItem(key, JSON.stringify(value));
  }

  public getData(key: string) {
    const value = localStorage.getItem(key);

    console.log('StorageService.getData', key, value);

    if (value) {
      return JSON.parse(value);
    }

    return value;
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}
