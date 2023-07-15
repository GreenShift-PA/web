import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';

export interface UserResponse {
  follow: any[];
  _id: string;
  login: string;
  password: string;
  roles: any[];
  tree: string;
  posts: any[];
  todoTask: any[];
  address: string;
  phone: string;
  skills: string[];
  hobbies: string[];
  job: string;
  aboutMe: string;
  workHistory: string[];
  joinDate: Date;
  organization: string;
  birthday: Date;
  languages: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private token: TokenService) {}




  getMe(): Observable<UserResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserResponse>("http://localhost:3000/user/me", { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }

  getUser(): Observable<UserResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<UserResponse>("http://localhost:3000/user/me", { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }

  patchUser(user: any): Observable<UserResponse> {
    const token = this.token.getItemWithExpiry('token');
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.patch<UserResponse>('http://localhost:3000/user/', user, { headers });
    } else {
      throw new Error('Token not found in local storage');
    }
  }
}