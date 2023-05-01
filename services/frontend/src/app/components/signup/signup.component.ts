import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  password = '';

  constructor(private userService: UserService) { }

  signup(): void {
    this.userService.register(this.email, this.password);
    // Redirect to home page or login page
  }
}