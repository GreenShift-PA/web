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
    like:any[],
    subtask: any[],
    isReview: boolean,
    difficulty: number,
    creationDate:Date,
    userId:string,
    image_proof:string
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient, private token: TokenService) {}


  acceptTask(taskId:string):Observable<TaskResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const body={
        todo_id:taskId,
        isDone : true,
        isReviewed : false, 
        isAccepted:true
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.patch<TaskResponse>("http://localhost:3000/todo/status",body , { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }
  refuseTask(taskId:string):Observable<TaskResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const body={
        todo_id:taskId,
        isDone : true,
        isReviewed : false, 
        isAccepted:false
      }
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.patch<TaskResponse>("http://localhost:3000/todo/status",body , { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }



  getAllReviewTasks(): Observable<TaskResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<TaskResponse>("http://localhost:3000/todo/pending", { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }

  getLinkedPost(todoId:string): Observable<TaskResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<TaskResponse>(`http://localhost:3000/todo/post?todo_id=${todoId}`, { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }
  
  addToMyTasks(todoId:string): Observable<TaskResponse> {
    
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<TaskResponse>(`http://localhost:3000/todo/default?todo_id=${todoId}`, { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }


  getMyTasks(): Observable<TaskResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<TaskResponse>("http://localhost:3000/todo", { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }
  getDefaultTasks(): Observable<TaskResponse> {
    const token = this.token.getItemWithExpiry("token");
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get<TaskResponse>("http://localhost:3000/todo/default", { headers });
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
      return this.http.patch<TaskResponse>("http://localhost:3000/todo/statusGuest",task, { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }

}