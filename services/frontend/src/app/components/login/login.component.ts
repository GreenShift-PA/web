import { Component,Renderer2 , OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from "src/app/services/token.service";
import { Router } from '@angular/router';
import { ToastrService } from "ngx-toastr";

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
  toastText: string = "Failed to authenticate";
  toastIcon: string =  "cancel";

  loginFail:boolean=false;
  constructor(private http: HttpClient, private router: Router, private token:TokenService,private toastr:ToastrService) {
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
          this.toastr.success("Logged in successfully.");
          this.router.navigate(['/profile']);
        },
        (error) => {
          console.error(error);
          this.toastr.error('Failed to authenticate');

          // this.loginFail=true;
          // setTimeout(() => {
          //   this.loginFail=false;
          // }, 2000); // Adjust the delay duration as needed
        }        
      );
    }


}
