import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor() { }

  getMe(): Observable<UserResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserResponse>("http://localhost:3000/user/me", { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }

}