import { Injectable } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {
  roles: any[] = [];

  constructor(private userService: UserService) {
    this.loadUserRoles();
  }

  private loadUserRoles(): void {
    this.userService.getMe().subscribe(
      (response) => {
        console.log(response._id);
        this.roles = response.roles;
        console.log("roles", this.roles);
        console.log("roles", response.roles);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  isAdmin(): boolean {
    return this.roles.some((role: any) => role.name === 'admin');
  }
}
