import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private tokenService: TokenService, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authToken = localStorage.getItem('token');


    if (authToken){
      const parsedToken = JSON.parse(authToken);
      this.tokenService.isValid(parsedToken.value).subscribe(
        (response) => {
          console.log(response)
          return false 
        },
        (error) => {
          console.log(error)
          this.authService.logout()
          this.router.navigate(['/login']); // Redirect to login page if no token
          return true
        }
      )
    }

    return true;
  }
}
