import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';


export interface PostResponse {
  _id: string,
  title: boolean,
  description: string,
  like: Date,
  comments: any[],
  whoValidates: number
  treeLinked: boolean,
  userId:string,
  creationDate:Date
}
@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private token: TokenService) { }

//   getMe(): Observable<UserResponse> {
//     const token = this.token.getItemWithExpiry("token");
//     if (token) {
//       const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
//       return this.http.get<UserResponse>("http://localhost:3000/user/me", { headers });
//     } else {
//       throw new Error("Token not found in local storage");
//     }
//   }



getAllPosts(): Observable<PostResponse> {
  const token = this.token.getItemWithExpiry("token");
  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<PostResponse>("http://localhost:3000/post/all", { headers });
  } else {
    throw new Error("Token not found in local storage");
  }
}

sendPost(description:string, image: string): Observable<PostResponse> {
    const token = this.token.getItemWithExpiry("token");
    const body={
        title:"test",
        description:description,
        image_proof: image
    }
    console.log(body)
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post<PostResponse>("http://localhost:3000/post",body, { headers });
    } else {
      throw new Error("Token not found in local storage");
    }
  }

createPostInTask(taskId:string,description:string): Observable<PostResponse> {
  const token = this.token.getItemWithExpiry("token");
  const body={
    todo_id: taskId,
      title:"test",
      description:description,
        image_proof: "https://upload.wikimedia.org/wikipedia/commons/5/56/Chain_link_icon_slanted.png"
  }
  console.log(body)
  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<PostResponse>("http://localhost:3000/todo/post",body, { headers });
  } else {
    throw new Error("Token not found in local storage");
  }
}


deletePost(idPost:string): Observable<any> {
  console.log(idPost)
  const token = this.token.getItemWithExpiry("token");
  if (token) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log(headers);
    return this.http.delete<any>(`http://localhost:3000/post/?id=${idPost}`, { headers });
  } else {
    throw new Error("Token not found in local storage");
  }
}
}