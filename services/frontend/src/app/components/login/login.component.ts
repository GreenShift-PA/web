import { Component,Renderer2 , OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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

  constructor() {}

  onSubmit(user: any) {
    console.log(user);
  }
}
