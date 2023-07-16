import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';

export interface TaskResponse {
    _id: string,
    isDone: boolean,
    title: string,
    description: string,
    deadline: Date,
    subtask: any[],
    isReview: boolean,
    difficulty: number
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient, private token: TokenService) {}




  getMyTasks(): Observable<TaskResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<TaskResponse>("http://localhost:3000/todo", { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }
  
  updateTaskById(task:any): Observable<TaskResponse> {
    const token = this.token.getItemWithExpiry("token");

    console.log(task);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.patch<TaskResponse>("http://localhost:3000/todo",task, { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }

  sendForReview(task:any): Observable<TaskResponse> {
    const token = this.token.getItemWithExpiry("token");

    console.log(task);
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.patch<TaskResponse>("http://localhost:3000/todo/status",task, { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }

}