import { Component,Renderer2 , OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from "src/app/services/token.service";
import { Router } from '@angular/router';

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



  constructor(private http: HttpClient, private router: Router, private token:TokenService) {
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
  const storedData = this.token.getItemWithExpiry("token");
  if (storedData) {
    console.log(storedData)
  } else {
  console.log("token not found in local storage")

  }
 

    }



    onSubmit(user: any) {
      const userData = {
        login: user.email,
        password: user.password
      };
    
      this.http.post('http://localhost:3000/auth/login', userData).subscribe(
        (response:any) => {
          console.log(response);
          this.token.setItemWithExpiry("token",response.token,7);
          this.router.navigate(['/profile']);

        },
        (error) => {
          console.error(error);
        }
      );
    }


}
