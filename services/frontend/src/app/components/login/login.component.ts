import { Component,Renderer2 , OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';

type ResponseType={
  token:string;
}
function setItemWithExpiry(key: string, value: any, expiryInDays: number): void {
  const now = new Date();
  const expirationDate = new Date(now.getTime() + expiryInDays * 24 * 60 * 60 * 1000);
  const item = {
    value: value,
    expiry: expirationDate.getTime()
  };
  localStorage.setItem(key, JSON.stringify(item));
}


function getItemWithExpiry(key: string): any {
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



  constructor(private http: HttpClient, private router: Router) {
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
  const storedData = getItemWithExpiry("token");
  if (storedData) {
    console.log(storedData)
  } else {
  console.log("token not found in local storage")

  }
  //   this.http.get('http://localhost:3000/tree/all').subscribe(
  //   (response:any) => {
  //     console.log(response.token);
  //   },
  //   (error) => {
  //     console.error(error);
  //   }

    
  // );

    }



    onSubmit(user: any) {
      const userData = {
        login: user.email,
        password: user.password
      };
    
      this.http.post('http://localhost:3000/auth/login', userData).subscribe(
        (response:any) => {
          console.log(response);
          setItemWithExpiry("token",response.token,7);
          this.router.navigate(['/profile']);

        },
        (error) => {
          console.error(error);
        }
      );
    }


}
