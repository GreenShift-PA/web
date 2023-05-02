import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) { }

  login(): void {
    if (this.authService.login(this.email, this.password)) {
      alert('Logged in!');
    } else {
      alert('Invalid email or password');
    }
  }
}
