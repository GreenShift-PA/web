import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authToken = localStorage.getItem('token');
    const isLoginRoute = state.url.includes('/login');
    const isSignUpRoute= state.url.includes('/signup');

    const isForgotPasswordRoute= state.url.includes('/forgot-password');
    if (isLoginRoute ||isSignUpRoute || isForgotPasswordRoute && authToken) {
      this.router.navigate(['/profile']); // Redirect to profile or home page if already authenticated
      return false;
    }

    if (!authToken) {
      this.router.navigate(['/login']); // Redirect to login page if no token
      return false;
    }

    return true;
  }
}
