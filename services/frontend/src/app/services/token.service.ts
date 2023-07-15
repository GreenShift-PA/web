import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

   setItemWithExpiry(key: string, value: any, expiryInDays: number): void {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiryInDays * 24 * 60 * 60 * 1000);
    const item = {
      value: value,
      expiry: expirationDate.getTime()
    };
    localStorage.setItem(key, JSON.stringify(item));
  }
  
  
   getItemWithExpiry(key: string): any {
    const item = localStorage.getItem(key);
    if (item) {
      const parsedItem = JSON.parse(item);
      if (parsedItem.expiry && parsedItem.expiry > Date.now()) {
        return parsedItem.value;
      } else {
        localStorage.removeItem(key);
      }
    }
    return null; // Item not found or expired
  }

}