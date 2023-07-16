import { Component, OnInit } from '@angular/core';
import { UserService, UserResponse } from 'src/app/services/user.service';

import { ToastrService } from "ngx-toastr";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{
  //a rajouter: nom, prénom, langues, hobbies ? country, city
   user: any = {
    address: '',
    job: '',
    aboutMe: '',
    birthday: new Date(),
    password:""
  };

  password:any={
    password:""
  }
 
  newPassword:string="";
  confirmPassword:string="";
  currentPassword:string="";
  city:string="";
  country:string="";
  firstname:string="";
  lastname:string="";
  email: string = "";
  address: string = "";
  tasks: string = "";
  skills: string[] = [];
  hobbies: string[] = [];
  roles: any[] = [];
  posts: string = "";
  job: string = "";
  aboutMe: string = "";
  joinDate: Date = new Date();
  birthday: Date = new Date();

  constructor(private userService: UserService, private toastr:ToastrService) {}

  ngOnInit() {
    this.userService.getMe().subscribe(
      (response) => {
        this.city=response.city;
        this.country= response.country;
        this.firstname = response.firstname;
        this.lastname = response.lastname;
        this.email = response.login;
        this.address = response.address;
        this.roles = response.roles;
        this.skills = response.skills;
        this.hobbies = response.hobbies;
        this.job = response.job;
        this.tasks = response.todoTask.length.toString();
        this.posts = response.posts.length.toString();
        this.aboutMe = response.aboutMe;
        this.joinDate = new Date(response.joinDate);
        this.birthday = new Date(response.birthday);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  
  onSubmit(user: any) {
    console.log(user)
    this.userService.patchUser(user).subscribe(
      (response) => {
        // Handle success response
        console.log(response);
              // Refresh the page
              this.toastr.success("User information updated successfully.");


      location.reload();
      },
      (error) => {
        // Handle error response
        this.toastr.warning("Something went wrong");
        console.error(error);
      }
    );
  }

  onSubmitPassword(password: any) {
    console.log(password)
    if (password.password !== password.confirmPassword) {
      // Passwords do not match, handle error
      this.toastr.warning("Passwords do not match");

      return;
    }
    this.userService.patchUser(password).subscribe(
      (response) => {
        // Handle success response
        console.log(response);
        this.toastr.success("User password updated successfully.");

      },
      (error) => {
        // Handle error response
        this.toastr.warning("Something went wrong");

        console.error(error);
      }
    );
  }
}

