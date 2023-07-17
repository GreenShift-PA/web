import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private http: HttpClient) { }

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

  isValid(token:string):Observable<any> {
      console.log(token)
      return this.http.get<any>(`http://localhost:3000/auth/check?token=${token}`)
  }

}