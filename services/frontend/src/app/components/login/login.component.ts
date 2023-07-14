import { Component,Renderer2 , OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


type ResponseType={
  token:string;
}

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



  constructor(private http: HttpClient) {
 }
 ngOnInit() {
  // Send GET request
  this.http.get('http://localhost:3000/').subscribe(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.error(error);
    }


  );

    this.http.get('http://localhost:3000/tree/all').subscribe(
    (response:any) => {
      console.log(response.token);
    },
    (error) => {
      console.error(error);
    }

    
  );

    }



    onSubmit(user: any) {
      const userData = {
        login: user.email,
        password: user.password
      };
    
      this.http.post('http://localhost:3000/auth/login', userData).subscribe(
        (response) => {
          console.log(response);
          localStorage.setItem("token","test")
        },
        (error) => {
          console.error(error);
        }
      );
    }


}
