import { Component,Renderer2 , OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  user = {
    email: null,
    password: null
  };

  constructor(private http: HttpClient) { this.getData().subscribe(
    (response) => {
      // Handle the response data
      console.log(response);
    },
    (error) => {
      // Handle any errors
      console.error(error);
    }
  );}

  getData(): Observable<any> {
    return this.http.get<any>('localhost:3000/tree/all');
  }

  
  onSubmit(user: any) {
    console.log(user);
  }
}
