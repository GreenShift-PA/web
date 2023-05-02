import { Injectable } from '@angular/core';

interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[] = [];

  constructor() { }

  register(email: string, password: string): void {
    this.users.push({ email, password });
    // this.users.forEach(element => {
    //   console.log(element.email);
    //   console.log(element.password);
    // });
  }
}
