import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-vertical-navbar',
  templateUrl: './vertical-navbar.component.html',
  styleUrls: ['./vertical-navbar.component.css']
})

export class VerticalNavbarComponent {

  constructor(private authService: AuthService) { }

  logout(): void {
    this.authService.logout();
  }
  isAuthenticated(): boolean {
    const authToken = localStorage.getItem('token');
    return !!authToken; // Returns true if authToken exists, false otherwise
  }
}
